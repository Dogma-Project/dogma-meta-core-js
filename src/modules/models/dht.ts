import StateManager from "../state";
import Datastore from "@seald-io/nedb";
import * as Types from "../../types";
import Model from "./_model";
import { getDatadir } from "../datadir";
import logger from "../logger";

class DHTModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.debug("nedb", "load database", "DHT");
      this.db = new Datastore({
        filename: getDatadir().nedb + "/dht.db",
      });
      await this.db.loadDatabaseAsync();
      // await this.db.ensureIndexAsync({
      //   fieldName: "param",
      //   unique: true,
      // });
      this.stateBridge.emit(Types.Event.Type.dhtDb, Types.System.States.ready);
    } catch (err) {
      logger.error("dht.nedb", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  get(params: { user_id: Types.User.Id; node_id?: Types.Node.Id }) {
    return this.db.findAsync(params);
  }

  async checkOrInsert(params: Types.DHT.Model) {
    try {
      const count = await this.db.countAsync(params);
      if (!count) {
        const { user_id, node_id } = params;
        await this.db.updateAsync({ user_id, node_id }, params, {
          upsert: true,
        });
        return Types.DHT.Response.ok;
      } else {
        return Types.DHT.Response.alreadyPresent;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default DHTModel;
