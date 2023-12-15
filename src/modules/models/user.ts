import generateSyncId from "../generateSyncId";
import { User } from "../../types";
import logger from "../logger";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
import { C_Event, C_System, C_Sync } from "@dogma-project/constants-meta";
import EncryptDb from "./dbEncryption/afterSerialization";
import DecryptDb from "./dbEncryption/beforeDeserialization";
import path from "node:path";

class UserModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  encrypt = true;
  private projection = { user_id: 1, name: 1, requested: 1, _id: 0 };
  private editable = ["name", "requested"];

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  public async init(encryptionKey?: string) {
    try {
      logger.log("nedb", "load database", "users");
      this.db = new Datastore({
        filename: path.join(getDatadir().nedb, "/users.db"),
        timestampData: true,
        afterSerialization: (str) => {
          if (encryptionKey && this.encrypt) {
            return EncryptDb(str, encryptionKey);
          } else {
            return str;
          }
        },
        beforeDeserialization: (str) => {
          if (encryptionKey) {
            return DecryptDb(str, encryptionKey);
          } else {
            return str;
          }
        },
      });
      await this.db.loadDatabaseAsync();
      await this.db.ensureIndexAsync({
        fieldName: "user_id",
        unique: true,
      });
      this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.ready);
    } catch (err) {
      logger.error("users.nedb", err);
    }
  }

  public async getAll() {
    return this.db.findAsync({}).projection(this.projection);
  }

  public async loadUsersTable() {
    try {
      logger.log("User Model", "Load user table");
      const users = await this.getAll();
      if (users.length) {
        this.stateBridge.emit(C_Event.Type.users, users);
        this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.full);
      } else {
        this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.empty);
      }
    } catch (err) {
      logger.error("user.nedb", err);
    }
  }

  private async loadUser(_id: string) {
    try {
      logger.log("User Model", "Load user", _id);
      const user = await this.db
        .findOneAsync({ _id })
        .projection(this.projection);
      if (user) {
        const users =
          this.stateBridge.get<Record<string, any>[]>(C_Event.Type.users) || [];
        let actual = users.find((u) => u.user_id === user.user_id);
        if (actual) {
          actual = user; // check
        } else {
          users.push(user);
        }
        this.stateBridge.emit(C_Event.Type.users, users);
      }
    } catch (err) {
      logger.error("node.nedb", "loadUser", err);
    }
  }

  /**
   * @todo delete proxy
   * Persist some user
   */
  public async persistUser(row: User.Model) {
    try {
      const { user_id } = row;
      const result = await this.db.updateAsync(
        { user_id },
        { $set: row },
        { upsert: true }
      );
      const records = result.affectedDocuments;
      if (records) {
        const record = !Array.isArray(records) ? records : records[0];
        if (!("sync_id" in record)) {
          const sync_id = generateSyncId(C_Sync.SIZES.USER_ID);
          await this.db.updateAsync({ user_id }, { $set: { sync_id } });
        }
        this.loadUser(record._id);
      }
      this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.full);
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   *
   * @param users array of users to persist
   * @returns {Promise}
   */
  public async persistUsers(users: User.Model[]) {
    try {
      for (let i = 0; i < users.length; i++) {
        await this.persistUser(users[i]);
      }
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @todo set to deleted state instead of remove
   */
  public async removeUser(user_id: User.Id) {
    try {
      await this.db.removeAsync({ user_id }, { multi: true });
      this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.reload); // downgrade state to reload database

      /*
      await nodesDb.removeAsync({ user_id }, { multi: true });
      this.stateBridge.emit("nodes-db", Types.System.States.reload); // downgrade state to reload database
      */

      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @todo delete _id
   */
  async sync(data: User.Model[], from: User.Id) {
    try {
      for (const row of data) {
        const { sync_id, user_id } = row;
        if (!sync_id) {
          logger.warn("node", "sync", "unknown sync_id", sync_id);
          continue;
        }
        // delete row._id;
        await this.db.updateAsync({ $or: [{ user_id }, { sync_id }] }, row, {
          upsert: true,
        });
      }
      this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.reload); // downgrade state to reload database
      // Sync.confirm("users", from);
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default UserModel;
