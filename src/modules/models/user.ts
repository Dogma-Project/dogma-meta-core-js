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
  private projection = { _id: 0 };
  public syncType = C_Sync.Type.users;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  public async init(encryptionKey?: string) {
    try {
      logger.log("nedb", "load database", "users");
      this.db = new Datastore({
        filename: path.join(getDatadir().nedb, "/users.db"),
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

  /**
   *
   * @param from Timestamp in milliseconds
   * @returns
   */
  public async getSync(from: number) {
    return this.db.findAsync({ updated: { $gt: from } }).projection({ _id: 0 });
  }

  /**
   * @todo log result
   * @param data
   * @returns
   */
  public async pushSync(data: Record<string, any>[]) {
    try {
      const users = this.stateBridge.get<User.Model[]>(C_Event.Type.users);
      if (!users || !users.length) {
        return logger.warn("USER SYNC", "Can't push sync. Users not loaded!");
      }
      logger.debug("!!!!!! User", data, users);
      for (const entry of data) {
        const current = users.find((u) => u.user_id === entry.user_id);
        if (!current || entry.updated > (current.updated || 0)) {
          const result = await this.db.updateAsync(
            {
              user_id: entry.user_id,
            },
            { $set: entry },
            { upsert: true }
          );
          logger.debug("SYNC USER", "Upserted new value!");
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
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
      logger.error("user.nedb", "loadUser", err);
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
        { $set: { ...row, updated: Date.now() } },
        { upsert: true }
      );
      const records = result.affectedDocuments;
      if (records) {
        const record = !Array.isArray(records) ? records : records[0];
        if (!("sync_id" in record)) {
          const sync_id = generateSyncId(C_Sync.SIZES.USER_ID);
          await this.db.updateAsync(
            { user_id },
            { $set: { sync_id, updated: Date.now() } }
          );
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
}

export default UserModel;
