import { sync as syncDb } from "../nedb";
import * as Types from "../../types";

const model = {
  async getAll() {
    return syncDb.findAsync({});
  },

  async get(db: string, node_id: Types.Node.Id) {
    return syncDb.findOneAsync({ db, node_id });
  },

  async confirm(db: string, node_id: Types.Node.Id) {
    const time = new Date().getTime(); // check
    return syncDb.updateAsync(
      { db, node_id },
      { db, node_id, time },
      { upsert: true }
    );
  },
};

module.exports = model;
export default model;
