import * as Types from "../../types";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";
import Model from "./_model";
import StateManager from "../state";
import { PROTOCOL } from "../../constants";

class ProtocolModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init(prefix: string) {
    try {
      logger.debug("nedb", "load database", "protocol");
      this.db = new Datastore({
        filename: getDatadir(prefix).nedb + "/protocol.db",
      });
      await this.db.loadDatabaseAsync();
      // await this.db.ensureIndexAsync({
      //   fieldName: "param",
      //   unique: true,
      // });
      this.stateBridge.emit(
        Types.Event.Type.protocolDb,
        Types.System.States.ready
      );
    } catch (err) {
      logger.error("protocol.nedb", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  // async persistProtocol(protocol: typeof PROTOCOL) {
  //   const newObject = Object.keys(protocol).map((key) => ({
  //     param: key,
  //     value: protocol[key],
  //   }));
  //   for (const row of newObject)
  //     await this.db.updateAsync({ param: row.param }, row, { upsert: true });
  //   this.stateBridge.emit(
  //     Types.Event.Type.configDb,
  //     Types.System.States.reload
  //   ); // downgrade state to reload database
  // }
}

export default ProtocolModel;
