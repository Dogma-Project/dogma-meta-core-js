import generateSyncId from "../generateSyncId";
import { Event, System, User } from "../../types";
import logger from "../logger";
import { nedbDir } from "../datadir";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";

class UserModel implements Model {
  stateBridge: StateManager;
  db: Datastore = new Datastore({
    filename: nedbDir + "/users.db",
    timestampData: true,
  });

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.debug("nedb", "load database", "users");
      await this.db.loadDatabaseAsync();
      await this.db.ensureIndexAsync({
        fieldName: "user_id",
        unique: true,
      });
      this.stateBridge.emit(Event.Type.usersDb, System.States.ready);
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
        this.stateBridge.emit(Event.Type.usersDb, System.States.full);
        this.stateBridge.emit(Event.Type.users, data);
      } else {
        this.stateBridge.emit(Event.Type.usersDb, System.States.empty);
      }
    } catch (err) {
      logger.error("user.nedb", err);
    }
  }

  async persistUser(user: User.Model) {
    try {
      const { user_id } = user;
      this.stateBridge.emit(Event.Type.usersDb, user_id);
      const exist = await this.db.findOneAsync({ user_id });
      const sync_id = generateSyncId(5);
      let result;
      if (exist && exist.user_id) {
        if (!exist.sync_id) user.sync_id = sync_id;
        result = await this.db.updateAsync({ user_id }, { $set: user });
      } else {
        result = await this.db.insertAsync({ ...user, sync_id });
      }
      this.stateBridge.emit(Event.Type.usersDb, System.States.reload); // downgrade state to reload database
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @todo set to deleted state instead of remove
   */
  async removeUser(user_id: User.Id) {
    try {
      await this.db.removeAsync({ user_id }, { multi: true });
      this.stateBridge.emit(Event.Type.usersDb, System.States.reload); // downgrade state to reload database

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
          logger.debug("node", "sync", "unknown sync_id", sync_id);
          continue;
        }
        // delete row._id;
        await this.db.updateAsync({ $or: [{ user_id }, { sync_id }] }, row, {
          upsert: true,
        });
      }
      this.stateBridge.emit(Event.Type.usersDb, System.States.reload); // downgrade state to reload database
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
