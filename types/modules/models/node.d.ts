import * as Types from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class NodeModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    constructor({ state }: {
        state: StateManager;
    });
    init(): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    getByUserId(user_id: Types.User.Id): Promise<Record<string, any>[]>;
    /**
     *
     * @param nodes [{name, node_id, user_id, public_ipv4, router_port}]
     * @returns {Promise}
     */
    persistNodes(nodes: Types.Node.Model[]): Promise<unknown>;
    setNodePublicIPv4(node_id: Types.Node.Id, ip: string): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
    /**
     * @todo delete _id
     */
    sync(data: Types.Node.Model[], from: Types.Node.Id): Promise<boolean>;
}
export default NodeModel;
