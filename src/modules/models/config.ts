import { workerData } from "node:worker_threads";
import * as Types from "../../types";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";
import Model from "./_model";
import StateManager from "../state";
import { C_Connection, C_Defaults, C_Event, C_System } from "../../constants";

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

  public insertDefaults() {
    logger.log("CONFIG MODEL", "auto generation with defaults");
    return this.persistConfig([
      {
        param: C_Event.Type.configRouter,
        value: workerData.routerPort || C_Defaults.router,
      },
      {
        param: C_Event.Type.configAutoDefine,
        value: C_Defaults.autoDefineIp,
      },
      {
        param: C_Event.Type.configDhtAnnounce,
        value: C_Connection.Group.friends,
      },
      {
        param: C_Event.Type.configDhtLookup,
        value: C_Connection.Group.friends,
      },
      {
        param: C_Event.Type.configDhtBootstrap,
        value: C_Connection.Group.friends,
      },
      {
        param: C_Event.Type.configExternal,
        value: C_Defaults.external,
      },
      {
        param: C_Event.Type.configLocalDiscovery,
        value: C_Defaults.localDiscovery,
      },
    ]);
  }

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
