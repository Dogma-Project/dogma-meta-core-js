import generateSyncId from "../generateSyncId";
import logger from "../logger";
// import Sync from "./sync";
import { Event, System, Node, User, Sync } from "../../types";
import getDatadir from "../datadir";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";

class NodeModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.debug("nedb", "load database", "nodes");
      this.db = new Datastore({
        filename: getDatadir().nedb + "/nodes.db",
        timestampData: true,
      });
      await this.db.loadDatabaseAsync();
      await this.db.ensureIndexAsync({
        fieldName: "param",
        unique: true,
      });
      this.stateBridge.emit(Event.Type.nodesDb, System.States.ready);
    } catch (err) {
      logger.error("config.nodes", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  async loadNodesTable() {
    try {
      logger.log("Node Model", "Load node table");
      const data = await this.getAll();
      if (data.length) {
        this.stateBridge.emit(Event.Type.nodesDb, System.States.full);
        this.stateBridge.emit(Event.Type.nodes, data);
      } else {
        this.stateBridge.emit(Event.Type.nodesDb, System.States.empty);
      }
    } catch (err) {
      logger.error("node.nedb", err);
    }
  }

  async getByUserId(user_id: User.Id) {
    return this.db.findAsync({ user_id });
  }

  /**
   *
   * @param nodes [{name, node_id, user_id, public_ipv4, router_port}]
   * @returns {Promise}
   */
  persistNodes(nodes: Node.Model[]) {
    // add validation

    const insert = async (row: Node.Model) => {
      try {
        const { node_id, user_id } = row;
        const result = await this.db.updateAsync(
          { node_id, user_id },
          { $set: row },
          { upsert: true }
        );
        if (result.affectedDocuments) {
          if (!Array.isArray(result.affectedDocuments)) {
            if (!("sync_id" in result.affectedDocuments)) {
              const sync_id = generateSyncId(Sync.SIZES.NODE_ID);
              const res = await this.db.updateAsync(
                { node_id, user_id },
                { $set: { sync_id } }
              );
            }
          } else {
            logger.warn(
              "Nodes model",
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
        for (let i = 0; i < nodes.length; i++) {
          await insert(nodes[i]);
        }
        this.stateBridge.emit(Event.Type.nodesDb, System.States.reload); // downgrade state to reload database
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async setNodePublicIPv4(node_id: Node.Id, ip: string) {
    return this.db.updateAsync({ node_id }, { $set: { public_ipv4: ip } });
  }

  /**
   * @todo delete _id
   */
  async sync(data: Node.Model[], from: Node.Id) {
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
      this.stateBridge.emit(Event.Type.nodesDb, System.States.reload); // downgrade state to reload database
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
