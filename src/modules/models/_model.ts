import Datastore from "@seald-io/nedb";
import StateManager from "../state";
import { C_Sync } from "../../constants";
import { ValuesOf } from "../../types/_main";

export default interface Model {
  db: Datastore;
  stateBridge: StateManager;
  encrypt: boolean;
  encryptionKey?: string;
  init: (encryptionKey?: string) => void;
  getAll: () => Promise<Record<string, any>[]>;
  getSync?: (from: number) => Promise<Record<string, any>[]>;
  pushSync?: (data: Record<string, any>[]) => Promise<void>;
  syncType?: ValuesOf<typeof C_Sync.Type>;
}
