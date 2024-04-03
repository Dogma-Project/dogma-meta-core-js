import StateManager from "../state";
import Datastore from "@seald-io/nedb";
import * as Types from "../../types";
import Model from "./_model";
import { getDatadir } from "../datadir";
import logger from "../logger";
import { C_Event, C_System, C_DHT } from "../../constants";

class DHTModel implements Model {
  stateBridge: StateManager;
  encrypt: boolean = false;
  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.log("nedb", "load database", "DHT");
      this.db = new Datastore({
        filename: getDatadir().nedb + "/dht.db",
      });
      await this.db.loadDatabaseAsync();
      // await this.db.ensureIndexAsync({
      //   fieldName: "param",
      //   unique: true,
      // });
      this.stateBridge.emit(C_Event.Type.dhtDb, C_System.States.ready);
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
        await this.db.updateAsync(
          { user_id, node_id },
          { ...params, updated: Date.now() },
          {
            upsert: true,
          }
        );
        return C_DHT.Response.ok;
      } else {
        return C_DHT.Response.alreadyPresent;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default DHTModel;
