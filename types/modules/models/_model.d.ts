import Datastore from "@seald-io/nedb";
import StateManager from "../state";
export default interface Model {
    db: Datastore;
    stateBridge: StateManager;
    init: (prefix: string) => void;
    getAll: () => Promise<Record<string, any>[]>;
}
