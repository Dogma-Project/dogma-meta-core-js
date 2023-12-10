import StateManager from "../state";
import Model from "./_model";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";
import * as Types from "../../types";
import { C_Event, C_System, C_Message } from "@dogma-project/constants-meta";

class MessageModel implements Model {
  stateBridge: StateManager;
  encrypt: boolean = true;
  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init(prefix: string) {
    try {
      logger.log("nedb", "load database", "messages");
      this.db = new Datastore({
        filename: getDatadir(prefix).nedb + "/messages.db",
        timestampData: true,
      });
      await this.db.loadDatabaseAsync();
      await this.db.ensureIndexAsync({
        fieldName: "sync_id",
        unique: true,
      });
      this.stateBridge.emit(C_Event.Type.messagesDb, C_System.States.ready);
    } catch (err) {
      logger.error("messages.nedb", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  async getAllByType(type: number) {
    // edit type
    return this.db.findAsync({ type }).sort({ createdAt: 1 });
  }

  async get({ id, since, type }: { id: string; since: number; type: number }) {
    // edit types
    return this.db.findAsync({ type, id }).sort({ createdAt: 1 });
  }

  async getStatus({ id, type }: { id: string; type: number }) {
    // edit types
    try {
      // return messagesDb.findAsync({ type, id }).sort({ createdAt: -1 }).limit(1);
      const message = await this.db
        .findOneAsync({ type, id })
        .sort({ createdAt: -1 });
      const text = message ? message.text || (message.files && "File") : "...";
      const from = message ? message.direction : null;
      return {
        text,
        from,
        newMessages: 0,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async push(params: Types.Message.Model) {
    params.type = params.type || C_Message.Type.direct;
    return this.db.insertAsync(params);
  }

  /**
   *
   * @param {Array} data
   * @param {String} from node_id
   */
  /*
  async sync(data, from) {
    try {
      for (const row of data) {
        const { _id, sync_id } = row;
        if (!sync_id) {
          logger.debug("node", "sync", "unknown sync_id", _id);
          continue;
        }
        delete row._id;
        await messagesDb.updateAsync({ sync_id }, row, { upsert: true });
      }
      Sync.confirm("messages", from);
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  */

  /**
   *
   * @param {String} node_id
   * @returns
   */

  /*
  async getSync(node_id) {
    try {
      const updated = await Sync.get("messages", node_id);
      const time = updated && updated.time ? updated.time : 1;
      const nedbTime = new Date(time);
      return messagesDb.findAsync({
        sync_id: { $exists: true },
        updatedAt: { $gt: nedbTime },
        $not: { direction: MESSAGES.DIRECT },
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  */
}

export default MessageModel;
