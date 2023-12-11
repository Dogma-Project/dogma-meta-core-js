import * as Types from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class SyncModel implements Model {
    stateBridge: StateManager;
    encrypt: boolean;
    db: Datastore;
    constructor({ state }: {
        state: StateManager;
    });
    init(): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    get(db: string, node_id: Types.Node.Id): Promise<Record<string, any>>;
    confirm(db: string, node_id: Types.Node.Id): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
}
export default SyncModel;
