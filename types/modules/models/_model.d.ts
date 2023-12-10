import Datastore from "@seald-io/nedb";
import StateManager from "../state";
export default interface Model {
    db: Datastore;
    stateBridge: StateManager;
    encrypt: boolean;
    encryptionKey?: string;
    init: (prefix: string, encryptionKey?: string) => void;
    getAll: () => Promise<Record<string, any>[]>;
}
