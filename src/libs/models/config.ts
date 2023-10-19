import { STATES } from "../../constants";
import { emit } from "../state";
import { config as configDb } from "../nedb";
import { Types } from "../../types";

const model = {
  async getAll() {
    return configDb.findAsync({});
  },

  persistConfig(config: Types.Config.Model) {
    type Entry = {
      param: string;
      value: string | number;
    };
    const insert = (row: Entry) => {
      return new Promise((resolve, reject) => {
        configDb.update(
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
        emit("config-db", STATES.RELOAD); // downgrade state to reload database
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default model;
