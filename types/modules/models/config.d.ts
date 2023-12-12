import * as Types from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class ConfigModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    encrypt: boolean;
    private projection;
    constructor({ state }: {
        state: StateManager;
    });
    init(): Promise<void>;
    loadConfigTable(): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    persistConfig(config: Types.Config.Model): Promise<void>;
}
export default ConfigModel;
