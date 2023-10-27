import generateSyncId from "../generateSyncId";
import logger from "../logger";
// import Sync from "./sync";
import * as Types from "../../types";
import { nedbDir } from "../datadir";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";

class NodeModel implements Model {
  stateBridge: StateManager;
  db: Datastore = new Datastore({
    filename: nedbDir + "/nodes.db",
    timestampData: true,
  });

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.debug("nedb", "load database", "nodes");
      await this.db.loadDatabaseAsync();
      await this.db.ensureIndexAsync({
        fieldName: "param",
        unique: true,
      });
      this.stateBridge.emit(
        Types.Event.Type.nodesDb,
        Types.System.States.ready
      );
    } catch (err) {
      logger.error("config.nodes", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  async getByUserId(user_id: Types.User.Id) {
    return this.db.findAsync({ user_id });
  }

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

        const exist = await this.db.findOneAsync({ node_id, user_id });
        let result;
        if (exist && exist.node_id) {
          if (!exist.sync_id) row.sync_id = generateSyncId(5);
          result = await this.db.updateAsync(
            { node_id, user_id },
            { $set: row }
          );
        } else {
          const sync_id = generateSyncId(5);
          result = await this.db.insertAsync({ ...row, sync_id });
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
        this.stateBridge.emit(
          Types.Event.Type.nodesDb,
          Types.System.States.reload
        ); // downgrade state to reload database
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async setNodePublicIPv4(node_id: Types.Node.Id, ip: string) {
    return this.db.updateAsync({ node_id }, { $set: { public_ipv4: ip } });
  }

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
        await this.db.updateAsync(
          { $or: [{ $and: [{ user_id }, { node_id }] }, { sync_id }] },
          row,
          { upsert: true }
        );
      }
      this.stateBridge.emit(
        Types.Event.Type.nodesDb,
        Types.System.States.reload
      ); // downgrade state to reload database
      // Sync.confirm("nodes", from);
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /*
  async getSync(node_id: Types.Node.Id) {
    try {
      const updated = await Sync.get("nodes", node_id);
      const time = updated && updated.time ? updated.time : 1;
      const nedbTime = new Date(time);
      return this.db.findAsync({
        sync_id: { $exists: true },
        updatedAt: { $gt: nedbTime },
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  */
}

export default NodeModel;