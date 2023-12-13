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

  /**
   * Update some value directly
   */
  private makeProxy(i: Record<string, any>) {
    const model = this;
    const proxyHandler: ProxyHandler<User.Model> = {
      get(target, key) {
        return target[key];
      },
      set(target, key: string, value: string | number | boolean) {
        if (model.editable.indexOf(key) > -1) {
          target[key] = value;
          console.log("SET!!!!!!!!!!!!!!", key, value);
          model.updateUserData(target.user_id, key, value).catch((err) => {
            logger.error("Proxy", "User model", err);
          });
          return true;
        } else {
          return false;
        }
      },
    };
    return new Proxy(i, proxyHandler);
  }

  public async loadUsersTable() {
    try {
      logger.log("User Model", "Load user table");
      const data = await this.getAll();
      if (data.length) {
        const users = data.map((i) => this.makeProxy(i));
        this.stateBridge.emit(C_Event.Type.users, users);
        this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.full);
      } else {
        this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.empty);
      }
    } catch (err) {
      logger.error("user.nedb", err);
    }
  }

  /**
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
        // add warning if length > 1
        let users = this.stateBridge.get<Record<string, any>[]>(
          C_Event.Type.users
        );
        if (!users) users = [];
        let actual = users.find((user) => user.user_id === user_id);
        const proxy = this.makeProxy(record);
        if (actual) {
          actual = proxy; // check
        } else {
          users.push(proxy);
        }
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
   * Update some data by proxy
   */
  private updateUserData(
    user_id: User.Id,
    key: string,
    value: string | boolean | number
  ) {
    const query: {
      [index: typeof key]: typeof value;
    } = {};
    query[key] = value;
    return this.db.updateAsync({ user_id }, { $set: query });
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
