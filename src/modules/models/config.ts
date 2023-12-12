import * as Types from "../../types";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";
import Model from "./_model";
import StateManager from "../state";
import { C_Event, C_System } from "@dogma-project/constants-meta";
class ConfigModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  encrypt = false;
  private projection = { param: 1, value: 1, _id: 0 };

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init() {
    try {
      logger.log("nedb", "load database", "config");
      this.db = new Datastore({
        filename: getDatadir().nedb + "/config.db",
      });
      await this.db.loadDatabaseAsync();
      await this.db.ensureIndexAsync({
        fieldName: "param",
        unique: true,
      });
      this.stateBridge.emit(C_Event.Type.configDb, C_System.States.ready);
    } catch (err) {
      logger.error("config.nedb", err);
    }
  }

  // private convertTypes(
  //   type: Types.Event.Type.Config,
  //   value: any
  // ): number | string | boolean {
  //   switch (type) {
  //     case Types.Event.Type.configRouter:
  //     case Types.Event.Type.configDhtAnnounce:
  //     case Types.Event.Type.configDhtBootstrap:
  //     case Types.Event.Type.configDhtLookup:
  //       return Number(value);
  //     case Types.Event.Type.configExternal:
  //     case Types.Event.Type.configPublicIpV4:
  //       return value as string;
  //     case Types.Event.Type.configAutoDefine:
  //     case Types.Event.Type.configLocalDiscovery:
  //       return !!value;
  //     default:
  //       return value as string;
  //   }
  // }

  async loadConfigTable() {
    try {
      logger.log("Config Model", "Load config table");
      const data = await this.getAll();
      if (data.length) {
        // add condition
        data.forEach((element) => {
          this.stateBridge.emit(element.param, element.value);
        });
        /**
         * @todo edit empty fields check
         */
        this.stateBridge.emit(C_Event.Type.configDb, C_System.States.full);
      } else {
        this.stateBridge.emit(C_Event.Type.configDb, C_System.States.empty);
      }
    } catch (err) {
      logger.error("config.nedb", err);
    }
  }

  async getAll() {
    return this.db.findAsync({}).projection(this.projection);
  }

  async persistConfig(config: Types.Config.Model) {
    const model = Array.isArray(config) ? config : [config];
    for (const row of model) {
      await this.db.updateAsync({ param: row.param }, row, { upsert: true });
      this.stateBridge.emit(row.param, row.value);
    }
    this.stateBridge.emit(C_Event.Type.configDb, C_System.States.full);
  }
}

export default ConfigModel;
