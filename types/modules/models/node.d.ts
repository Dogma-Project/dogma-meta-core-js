import { Node, User } from "../../types";
import Datastore from "@seald-io/nedb";
import Model from "./_model";
import StateManager from "../state";
import { C_Sync } from "@dogma-project/constants-meta";
declare class NodeModel implements Model {
    stateBridge: StateManager;
    db: Datastore;
    encrypt: boolean;
    private projection;
    syncType: C_Sync.Type;
    constructor({ state }: {
        state: StateManager;
    });
    init(encryptionKey?: string): Promise<void>;
    getAll(): Promise<Node.Model[]>;
    /**
     *
     * @param from Timestamp in milliseconds
     * @returns
     */
    getSync(from: number): Promise<Node.Model[]>;
    pushSync(data: Record<string, any>[]): Promise<undefined>;
    get(user_id: string, node_id: string): Promise<Node.Model>;
    loadNodesTable(): Promise<void>;
    getByUserId(user_id: User.Id): Promise<Node.Model[]>;
    /**
     * @param row
     * @returns
     */
    persistNode(row: Node.Model): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Node.Model> | import("@seald-io/nedb").Document<Node.Model>[] | null;
        upsert: boolean;
    }>;
    /**
     *
     * @param users array of nodes to persist
     * @returns {Promise}
     */
    persistNodes(nodes: Node.Model[], user_id: User.Id): Promise<boolean>;
}
export default NodeModel;
