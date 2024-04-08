import { User } from "../../types";
import logger from "../logger";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
import { C_Event, C_System, C_Sync } from "../../constants";
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
        sparse: true,
      });
      this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.ready);
    } catch (err) {
      logger.error("users.nedb", err);
    }
  }

  public async getAll() {
    return this.db
      .findAsync<User.Model>({ deleted: { $ne: true } })
      .projection(this.projection);
  }

  public async get(user_id: User.Id) {
    return this.db
      .findOneAsync<User.Model>({ user_id })
      .projection(this.projection);
  }

  /**
   *
   * @param from Timestamp in milliseconds
   * @returns
   */
  public async getSync(from: number) {
    return this.db
      .findAsync<User.Model>({ updated: { $gt: from } })
      .projection(this.projection);
  }

  public async pushSync(data: Record<string, any>[]) {
    try {
      for (const entry of data) {
        try {
          const result = await this.db.updateAsync(
            {
              user_id: entry.user_id,
              updated: { $lt: entry.updated },
            },
            data,
            { upsert: true }
          );
          logger.debug("SYNC USER", "Upserted new value!", result);
        } catch (err: any) {
          if (err.errorType && err.errorType === "uniqueViolated") {
            logger.warn("SYNC USER", "SKIP SYNC", entry.updated);
          } else {
            logger.error("SYNC USER", err);
          }
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async loadUsersTable() {
    try {
      logger.log("User Model", "Load user table");
      const count = await this.db.countAsync({ deleted: { $ne: true } });
      if (count) {
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
      if (!user_id || !user_id.length) {
        return Promise.reject("Empty user_id. Can't persist.");
      }
      const result = await this.db.updateAsync<User.Model>(
        { user_id },
        { $set: { ...row, updated: Date.now() } },
        { upsert: true }
      );
      this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.reload);
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
   * @todo delete all nodes
   * @param user_id
   * @returns
   */
  public async removeUser(user_id: User.Id) {
    return this.db.updateAsync<User.Model>(
      { user_id },
      { user_id, deleted: true, updated: Date.now() }
    );
  }
}

export default UserModel;
