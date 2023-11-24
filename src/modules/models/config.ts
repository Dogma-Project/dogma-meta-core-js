import * as Types from "../../types";
import getDatadir from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";
import Model from "./_model";
import StateManager from "../state";

class ConfigModel implements Model {
  stateBridge: StateManager;

  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.debug("nedb", "load database", "config");
      this.db = new Datastore({
        filename: getDatadir().nedb + "/config.db",
      });
      await this.db.loadDatabaseAsync();
      await this.db.ensureIndexAsync({
        fieldName: "param",
        unique: true,
      });
      this.stateBridge.emit(
        Types.Event.Type.configDb,
        Types.System.States.ready
      );
    } catch (err) {
      logger.error("config.nedb", err);
    }
  }

  async loadConfigTable() {
    try {
      logger.log("Config Model", "Load config table");
      const data = await this.getAll();
      if (data.length) {
        // add condition
        data.forEach((element) => {
          const type: Types.Event.Type = element.param;
          this.stateBridge.emit(type, element.value);
        });
        /**
         * @todo edit empty fields check
         */
        this.stateBridge.emit(
          Types.Event.Type.configDb,
          Types.System.States.full
        );
      } else {
        this.stateBridge.emit(
          Types.Event.Type.configDb,
          Types.System.States.empty
        );
      }
    } catch (err) {
      logger.error("config.nedb", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  async persistConfig(config: Types.Config.Model) {
    const model = Array.isArray(config) ? config : [config];
    for (const row of model) {
      await this.db.updateAsync({ param: row.param }, row, { upsert: true });
      this.stateBridge.emit(row.param, row.value);
    }
    this.stateBridge.emit(Types.Event.Type.configDb, Types.System.States.full);
  }
}

export default ConfigModel;
