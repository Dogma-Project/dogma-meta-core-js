import * as Types from "../../types";
import { getDatadir } from "../datadir";
import Datastore from "@seald-io/nedb";
import logger from "../logger";
import Model from "./_model";
import StateManager from "../state";
import { C_Event, C_System } from "@dogma-project/constants-meta";

class FileModel implements Model {
  stateBridge: StateManager;
  db!: Datastore;

  constructor({ state }: { state: StateManager }) {
    this.stateBridge = state;
  }

  async init(prefix: string) {
    try {
      logger.log("nedb", "load database", "files");
      this.db = new Datastore({
        filename: getDatadir(prefix).nedb + "/files.db",
      });
      await this.db.loadDatabaseAsync();
      // await this.db.ensureIndexAsync({
      //   fieldName: "param",
      //   unique: true,
      // });
      this.stateBridge.emit(C_Event.Type.filesDb, C_System.States.ready);
    } catch (err) {
      logger.error("files.nedb", err);
    }
  }

  async getAll() {
    return this.db.findAsync({});
  }

  async permitFileTransfer({
    user_id,
    file,
  }: {
    user_id: Types.User.Id;
    file: Types.File.Description;
  }) {
    const { descriptor, size, pathname } = file;
    return this.db.updateAsync(
      {
        user_id,
        descriptor,
      },
      {
        $set: {
          user_id,
          descriptor,
          size,
          pathname,
        },
      },
      {
        upsert: true,
      }
    );
  }

  async forbidFileTransfer({
    user_id,
    descriptor,
  }: {
    user_id: Types.User.Id;
    descriptor: number;
  }) {
    return this.db.removeAsync({ user_id, descriptor }, { multi: true });
  }

  async fileTransferAllowed({
    user_id,
    descriptor,
  }: {
    user_id: Types.User.Id;
    descriptor: number;
  }) {
    return this.db.findOneAsync({ user_id, descriptor });
  }
}

export default FileModel;
