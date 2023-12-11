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
// import generateCryptoKey from "./dbEncryption/generateCryptoKey";

class UserModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;
  encrypt = true;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init(encryptionKey?: string) {
    try {
      logger.log("nedb", "load database", "users");
      this.db = new Datastore({
        filename: getDatadir().nedb + "/users.db",
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

  async getAll() {
    return this.db.findAsync({});
  }

  async loadUsersTable() {
    try {
      logger.log("User Model", "Load user table");
      const data = await this.getAll();
      if (data.length) {
        this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.full);
        this.stateBridge.emit(C_Event.Type.users, data);
      } else {
        this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.empty);
      }
    } catch (err) {
      logger.error("user.nedb", err);
    }
  }

  /**
   *
   * @param users array of users to persist
   * @returns {Promise}
   */
  persistUsers(users: User.Model[]) {
    // add validation
    const insert = async (row: User.Model) => {
      try {
        const { user_id } = row;
        const result = await this.db.updateAsync(
          { user_id },
          { $set: row },
          { upsert: true }
        );
        if (result.affectedDocuments) {
          if (!Array.isArray(result.affectedDocuments)) {
            if (!("sync_id" in result.affectedDocuments)) {
              const sync_id = generateSyncId(C_Sync.SIZES.USER_ID);
              await this.db.updateAsync({ user_id }, { $set: { sync_id } });
            }
          } else {
            logger.warn(
              "Users model",
              "upsert multiple",
              result.affectedDocuments
            );
          }
        }
        return result;
      } catch (err) {
        return Promise.reject(err);
      }
    };

    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < users.length; i++) {
          await insert(users[i]);
        }
        this.stateBridge.emit(C_Event.Type.usersDb, C_System.States.reload); // downgrade state to reload database
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @todo set to deleted state instead of remove
   */
  async removeUser(user_id: User.Id) {
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

  //   /**
  //    *
  //    * @param {String} node_id
  //    * @returns
  //    */
  //   async getSync(node_id: ) {
  //     try {
  //       const updated = await Sync.get("users", node_id);
  //       const time = updated && updated.time ? updated.time : 1;
  //       const nedbTime = new Date(time);
  //       return usersDb.findAsync({
  //         sync_id: { $exists: true },
  //         updatedAt: { $gt: nedbTime },
  //       });
  //     } catch (err) {
  //       return Promise.reject(err);
  //     }
  //     },
}

export default UserModel;
