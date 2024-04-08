import logger from "../logger";
import { Node, User } from "../../types";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
import { C_Event, C_System, C_Sync } from "../../constants";
import EncryptDb from "./dbEncryption/afterSerialization";
import DecryptDb from "./dbEncryption/beforeDeserialization";
import path from "node:path";

class NodeModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  encrypt = true;
  private projection = { _id: 0 };
  private exportProjection = {
    _id: 0,
    node_id: 1,
    public_ipv4: 1,
    public_ipv6: 1,
    tor_addr: 1,
  };
  public syncType = C_Sync.Type.nodes;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init(encryptionKey?: string) {
    try {
      logger.log("nedb", "load database", "nodes");
      this.db = new Datastore({
        filename: path.join(getDatadir().nedb, "/nodes.db"),
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
        fieldName: ["user_id", "node_id"],
        unique: true,
        sparse: true,
      });
      this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.ready);
    } catch (err) {
      logger.error("config.nodes", err);
    }
  }

  public async getAll() {
    return this.db
      .findAsync<Node.Model>({ deleted: { $ne: true } })
      .projection(this.projection);
  }

  /**
   *
   * @param from Timestamp in milliseconds
   * @returns
   */
  public async getSync(from: number) {
    return this.db.findAsync<Node.Model>({ updated: { $gt: from } });
  }

  public async pushSync(data: Record<string, any>[]) {
    try {
      for (const entry of data) {
        try {
          const result = await this.db.updateAsync(
            {
              user_id: entry.user_id,
              node_id: entry.node_id,
              updated: { $lt: entry.updated },
            },
            data,
            { upsert: true }
          );
          logger.debug("SYNC NODE", "Upserted new value!", result);
        } catch (err: any) {
          if (err.errorType && err.errorType === "uniqueViolated") {
            logger.warn("SYNC NODE", "SKIP SYNC", entry.updated);
          } else {
            logger.error("SYNC NODE", err);
          }
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async get(
    user_id: string,
    node_id: string,
    onlyExport: true
  ): Promise<Node.ExportModel>;
  public async get(
    user_id: string,
    node_id: string,
    onlyExport?: false | undefined
  ): Promise<Node.Model>;
  public async get(user_id: string, node_id: string, onlyExport?: boolean) {
    const project = onlyExport ? this.exportProjection : this.projection;
    return this.db
      .findOneAsync<Node.Model | Node.ExportModel>({ user_id, node_id })
      .projection(project);
  }

  public async loadNodesTable() {
    try {
      logger.log("Node Model", "Load node table");
      const count = await this.db.countAsync({ deleted: { $ne: true } });
      if (count) {
        this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.full);
      } else {
        this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.empty);
      }
    } catch (err) {
      logger.error("node.nedb", err);
    }
  }

  async getByUserId(user_id: User.Id) {
    return this.db
      .findAsync<Node.Model>({ user_id })
      .projection(this.projection);
  }

  /**
   *
   * @param row
   * @returns
   */
  async persistNode(row: Node.Model) {
    try {
      const { node_id, user_id } = row;
      if (!user_id || !user_id.length) {
        return Promise.reject("Empty user_id. Can't persist node.");
      }
      if (!node_id || !node_id.length) {
        return Promise.reject("Empty node_id. Can't persist node.");
      }
      const result = await this.db.updateAsync<Node.Model>(
        { node_id, user_id },
        { $set: { ...row, updated: Date.now() } },
        { upsert: true }
      );
      this.stateBridge.emit(C_Event.Type.nodesDb, C_System.States.reload);
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   *
   * @param row
   * @returns
   */
  public async silentUpdateNode(row: Omit<Node.Model, "name">) {
    try {
      const { node_id, user_id } = row;
      return this.db.updateAsync<Node.Model>(
        { node_id, user_id },
        { $set: row }
      );
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

  public async removeNode(user_id: User.Id, node_id: Node.Id) {
    return this.db.updateAsync<Node.Model>(
      { user_id, node_id },
      { user_id, node_id, deleted: true, updated: Date.now() }
    );
  }
}

export default NodeModel;
