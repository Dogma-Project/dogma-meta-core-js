import { Node, User } from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
declare class NodeModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    encrypt: boolean;
    private projection;
    constructor({ state }: {
        state: StateManager;
    });
    init(encryptionKey?: string): Promise<void>;
    getAll(): Promise<Record<string, any>[]>;
    get(user_id: string, node_id: string): Promise<Record<string, any>>;
    loadNodesTable(): Promise<void>;
    private loadNode;
    getByUserId(user_id: User.Id): Promise<Record<string, any>[]>;
    persistNode(row: Node.Model): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
    /**
     *
     * @param users array of nodes to persist
     * @returns {Promise}
     */
    persistNodes(nodes: Node.Model[], user_id: User.Id): Promise<boolean>;
    /**
     * @deprecated
     * Update some data by proxy
     */
    private updateNodeData;
}
export default NodeModel;
