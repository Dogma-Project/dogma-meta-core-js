import StateManager from "../state";
import Model from "./_model";
import Datastore from "@seald-io/nedb";
import * as Types from "../../types";
declare class MessageModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    constructor({ state }: {
        state: StateManager;
    });
    init(): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    getAllByType(type: number): Promise<Record<string, any>[]>;
    get({ id, since, type }: {
        id: string;
        since: number;
        type: number;
    }): Promise<Record<string, any>[]>;
    getStatus({ id, type }: {
        id: string;
        type: number;
    }): Promise<{
        text: any;
        from: any;
        newMessages: number;
    }>;
    push(params: Types.Message.Model): Promise<import("@seald-io/nedb").Document<Types.Message.Model>>;
}
export default MessageModel;
