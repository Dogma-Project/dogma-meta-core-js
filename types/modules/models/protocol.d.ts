import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class ProtocolModel implements Model {
    stateBridge: StateManager;
    encrypt: boolean;
    db: Datastore;
    constructor({ state }: {
        state: StateManager;
    });
    init(): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
}
export default ProtocolModel;
