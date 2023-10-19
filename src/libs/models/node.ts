import { STATES } from "../../constants";
import { emit } from "../state";
import { nodes as nodesDb } from "../nedb";
import generateSyncId from "../../libs/generateSyncId";
import logger from "../../libs/logger";
import Sync from "./sync";
import { Types } from "../../types";

const model = {
  async getAll() {
    return nodesDb.findAsync({});
  },

  /**
   *
   * @param user_id
   */
  async getByUserId(user_id: Types.User.Id) {
    return nodesDb.findAsync({ user_id });
  },

  /**
   *
   * @param nodes [{name, node_id, user_id, public_ipv4, router_port}]
   * @returns {Promise}
   */
  persistNodes(nodes: Types.Node.Model[]) {
    // add validation

    const insert = async (row: Types.Node.Model) => {
      try {
        const { node_id, user_id } = row;
        if (!row.public_ipv4) delete row.public_ipv4;

        const exist = await nodesDb.findOneAsync({ node_id, user_id });
        let result;
        if (exist && exist.node_id) {
          if (!exist.sync_id) row.sync_id = generateSyncId(5);
          result = await nodesDb.updateAsync(
            { node_id, user_id },
            { $set: row }
          );
        } else {
          const sync_id = generateSyncId(5);
          result = await nodesDb.insertAsync({ ...row, sync_id });
        }
        return result;
      } catch (err) {
        return Promise.reject(err);
      }
    };

    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < nodes.length; i++) {
          await insert(nodes[i]);
        }
        emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   *
   * @param node_id
   * @param ip
   */
  async setNodePublicIPv4(node_id: Types.Node.Id, ip: string) {
    return nodesDb.updateAsync({ node_id }, { $set: { public_ipv4: ip } });
  },

  /**
   * @todo delete _id
   */
  async sync(data: Types.Node.Model[], from: Types.Node.Id) {
    try {
      for (const row of data) {
        const { sync_id, user_id, node_id } = row;
        if (!sync_id) {
          logger.debug("node", "sync", "unknown sync_id", sync_id);
          continue;
        }
        await nodesDb.updateAsync(
          { $or: [{ $and: [{ user_id }, { node_id }] }, { sync_id }] },
          row,
          { upsert: true }
        );
      }
      emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
      Sync.confirm("nodes", from);
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  /**
   *
   * @param node_id
   * @returns
   */
  async getSync(node_id: Types.Node.Id) {
    try {
      const updated = await Sync.get("nodes", node_id);
      const time = updated && updated.time ? updated.time : 1;
      const nedbTime = new Date(time);
      return nodesDb.findAsync({
        sync_id: { $exists: true },
        updatedAt: { $gt: nedbTime },
      });
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default model;
