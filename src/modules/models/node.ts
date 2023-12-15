import generateSyncId from "../generateSyncId";
import logger from "../logger";
import { Node, User } from "../../types";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
import { C_Event, C_System, C_Sync } from "@dogma-project/constants-meta";
import EncryptDb from "./dbEncryption/afterSerialization";
import DecryptDb from "./dbEncryption/beforeDeserialization";
import path from "node:path";

class NodeModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  encrypt = true;
  private projection = {
    user_id: 1,
    node_id: 1,
    name: 1,
    public_ipv4: 1,
    local_ipv4: 1,
    _id: 0,
  };

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init(encryptionKey?: string) {
    try {
      logger.log("nedb", "load database", "nodes");
      this.db = new Datastore({
        filename: path.join(getDatadir().nedb, "/nodes.db"),
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
      this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.ready);
    } catch (err) {
      logger.error("config.nodes", err);
    }
  }

  public async getAll() {
    return this.db.findAsync({}).projection(this.projection);
  }

  public async get(user_id: string, node_id: string) {
    return this.db
      .findOneAsync({ user_id, node_id })
      .projection(this.projection);
  }

  public async loadNodesTable() {
    try {
      logger.log("Node Model", "Load node table");
      const nodes = await this.getAll();
      if (nodes.length) {
        this.stateBridge.emit(C_Event.Type.nodes, nodes);
        this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.full);
      } else {
        this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.empty);
      }
    } catch (err) {
      logger.error("node.nedb", err);
    }
  }

  private async loadNode(_id: string) {
    try {
      logger.log("Node Model", "Load node", _id);
      const node = await this.db
        .findOneAsync({ _id })
        .projection(this.projection);
      if (node) {
        const nodes =
          this.stateBridge.get<Record<string, any>[]>(C_Event.Type.nodes) || [];
        let actual = nodes.find(
          (n) => n.user_id === node.user_id && n.node_id === node.node_id
        );
        if (actual) {
          actual = node; // check
        } else {
          nodes.push(node);
        }
        this.stateBridge.emit(C_Event.Type.nodes, nodes);
      }
    } catch (err) {
      logger.error("node.nedb", "loadNode", err);
    }
  }

  async getByUserId(user_id: User.Id) {
    return this.db.findAsync({ user_id }).projection(this.projection);
  }

  async persistNode(row: Node.Model) {
    try {
      const { node_id, user_id } = row;
      const result = await this.db.updateAsync(
        { node_id, user_id },
        { $set: row },
        { upsert: true }
      );
      const records = result.affectedDocuments;
      if (records) {
        const record = !Array.isArray(records) ? records : records[0];
        if (!("sync_id" in record)) {
          const sync_id = generateSyncId(C_Sync.SIZES.NODE_ID);
          await this.db.updateAsync(
            { user_id, node_id },
            { $set: { sync_id } }
          );
        }
        await this.loadNode(record._id);
      }
      this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.full);
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   *
   * @param users array of nodes to persist
   * @returns {Promise}
   */
  public async persistNodes(nodes: Node.Model[], user_id: User.Id) {
    try {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].user_id === user_id) {
          await this.persistNode(nodes[i]);
        } else {
          logger.warn("Persist Node", "User not match");
        }
      }
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @deprecated
   * Update some data by proxy
   */
  private updateNodeData(
    user_id: User.Id,
    node_id: Node.Id,
    key: string,
    value: string | boolean | number
  ) {
    const query: {
      [index: typeof key]: typeof value;
    } = {};
    query[key] = value;
    return this.db.updateAsync({ user_id, node_id }, { $set: query });
  }
}

export default NodeModel;
