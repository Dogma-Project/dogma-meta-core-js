import { Node, User } from "../../types";
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
    loadNodesTable(): Promise<void>;
    getByUserId(user_id: User.Id): Promise<Record<string, any>[]>;
    /**
     *
     * @param nodes [{name, node_id, user_id, public_ipv4, router_port}]
     * @returns {Promise}
     */
    persistNodes(nodes: Node.Model[]): Promise<unknown>;
    setNodePublicIPv4(node_id: Node.Id, ip: string): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
    /**
     * @todo delete _id
     */
    sync(data: Node.Model[], from: Node.Id): Promise<boolean>;
}
export default NodeModel;
