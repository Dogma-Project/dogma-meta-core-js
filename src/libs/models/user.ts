import { emit } from "../state";
// import { users as usersDb, nodes as nodesDb } from "../nedb";
import generateSyncId from "../../libs/generateSyncId";
import Sync from "./sync";
import { Types } from "../../types";
import logger from "../../libs/logger";
import { nedbDir } from "../../components/datadir";
import Datastore from "@seald-io/nedb";

const model = {
  usersDb: new Datastore({
    filename: nedbDir + "/users.db",
    timestampData: true,
  }),

  async init() {
    try {
      logger.debug("nedb", "load database", "users");
      await this.usersDb.loadDatabaseAsync();
      // await this.usersDb.ensureIndexAsync({
      //   fieldName: "user_id",
      //   unique: true,
      // });
      emit("users-db", Types.System.States.ready);
    } catch (err) {
      logger.error("users.nedb", err);
    }
  },

  async getAll() {
    return this.usersDb.findAsync({});
  },

  /**
   *
   * @param {Object} user
   * @param {String} user.name
   * @param {String} user.user_id
   * @param {String} user.cert
   * @param {Number} user.type
   * @returns {Promise}
   */
  async persistUser(user: Types.User.Model) {
    try {
      const { user_id } = user;
      emit("update-user", user_id);
      const exist = await this.usersDb.findOneAsync({ user_id });
      const sync_id = generateSyncId(5);
      let result;
      if (exist && exist.user_id) {
        if (!exist.sync_id) user.sync_id = sync_id;
        result = await this.usersDb.updateAsync({ user_id }, { $set: user });
      } else {
        result = await this.usersDb.insertAsync({ ...user, sync_id });
      }
      emit("users-db", Types.System.States.reload); // downgrade state to reload database
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  /**
   * @todo set to deleted state instead of remove
   */
  async removeUser(user_id: Types.User.Id) {
    try {
      await this.usersDb.removeAsync({ user_id }, { multi: true });
      emit("users-db", Types.System.States.reload); // downgrade state to reload database
      // await nodesDb.removeAsync({ user_id }, { multi: true });
      emit("nodes-db", Types.System.States.reload); // downgrade state to reload database
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  /**
   * @todo delete _id
   */
  async sync(data: Types.User.Model[], from: Types.User.Id) {
    try {
      for (const row of data) {
        const { sync_id, user_id } = row;
        if (!sync_id) {
          logger.debug("node", "sync", "unknown sync_id", sync_id);
          continue;
        }
        // delete row._id;
        await this.usersDb.updateAsync(
          { $or: [{ user_id }, { sync_id }] },
          row,
          {
            upsert: true,
          }
        );
      }
      emit("users-db", Types.System.States.reload); // downgrade state to reload database
      Sync.confirm("users", from);
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  },

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
};

export default model;
