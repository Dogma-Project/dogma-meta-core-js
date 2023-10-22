import { emit } from "../state-old";
import { Types } from "../../types";
import { nedbDir } from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";

const model = {
  configDb: new Datastore({
    filename: nedbDir + "/config.db",
  }),

  async init() {
    try {
      logger.debug("nedb", "load database", "config");
      await this.configDb.loadDatabaseAsync();
      await this.configDb.ensureIndexAsync({
        fieldName: "param",
        unique: true,
      });
      emit("config-db", Types.System.States.ready);
    } catch (err) {
      logger.error("config.nedb", err);
    }
  },

  async getAll() {
    return this.configDb.findAsync({});
  },

  persistConfig(config: Types.Config.Model) {
    type Entry = {
      param: string;
      value: string | number;
    };
    const insert = (row: Entry) => {
      return new Promise((resolve, reject) => {
        this.configDb.update(
          { param: row.param },
          row,
          { upsert: true },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    };

    const newObject = Object.keys(config).map((key) => {
      return {
        param: key,
        value: config[key],
      };
    });

    return new Promise(async (resolve, reject) => {
      try {
        for (const entry of newObject) await insert(entry);
        emit("config-db", Types.System.States.reload); // downgrade state to reload database
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default model;
