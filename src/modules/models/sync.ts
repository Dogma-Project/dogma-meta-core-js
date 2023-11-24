import * as Types from "../../types";
import getDatadir from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";
import Model from "./_model";
import StateManager from "../state";

class SyncModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.debug("nedb", "load database", "sync");
      this.db = new Datastore({
        filename: getDatadir().nedb + "/sync.db",
      });
      await this.db.loadDatabaseAsync();
      // await this.db.ensureIndexAsync({
      //   fieldName: "param",
      //   unique: true,
      // });
      this.stateBridge.emit(Types.Event.Type.syncDb, Types.System.States.ready);
    } catch (err) {
      logger.error("sync.nedb", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  async get(db: string, node_id: Types.Node.Id) {
    return this.db.findOneAsync({ db, node_id });
  }

  async confirm(db: string, node_id: Types.Node.Id) {
    const time = new Date().getTime(); // check
    return this.db.updateAsync(
      { db, node_id },
      { db, node_id, time },
      { upsert: true }
    );
  }
}

export default SyncModel;
