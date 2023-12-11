import StateManager from "../state";
import Datastore from "@seald-io/nedb";
import * as Types from "../../types";
import Model from "./_model";
import { C_DHT } from "@dogma-project/constants-meta";
declare class DHTModel implements Model {
    stateBridge: StateManager;
    encrypt: boolean;
    db: Datastore;
    constructor({ state }: {
        state: StateManager;
    });
    init(): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    get(params: {
        user_id: Types.User.Id;
        node_id?: Types.Node.Id;
    }): Datastore.Cursor<Record<string, any>[]>;
    checkOrInsert(params: Types.DHT.Model): Promise<C_DHT.Response.alreadyPresent | C_DHT.Response.ok>;
}
export default DHTModel;
