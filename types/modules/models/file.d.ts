import * as Types from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class FileModel implements Model {
    stateBridge: StateManager;
    encrypt: boolean;
    db: Datastore;
    constructor({ state }: {
        state: StateManager;
    });
    init(prefix: string): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    permitFileTransfer({ user_id, file, }: {
        user_id: Types.User.Id;
        file: Types.File.Description;
    }): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
    forbidFileTransfer({ user_id, descriptor, }: {
        user_id: Types.User.Id;
        descriptor: number;
    }): Promise<number>;
    fileTransferAllowed({ user_id, descriptor, }: {
        user_id: Types.User.Id;
        descriptor: number;
    }): Promise<Record<string, any>>;
}
export default FileModel;
