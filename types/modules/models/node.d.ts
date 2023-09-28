import { Types } from "../types";
declare const model: {
    getAll(): Promise<Record<string, any>[]>;
    /**
     *
     * @param user_id
     */
    getByUserId(user_id: Types.User.Id): Promise<Record<string, any>[]>;
    /**
     *
     * @param nodes [{name, node_id, user_id, public_ipv4, router_port}]
     * @returns {Promise}
     */
    persistNodes(nodes: Types.Node.Model[]): Promise<unknown>;
    /**
     *
     * @param node_id
     * @param ip
     */
    setNodePublicIPv4(node_id: Types.Node.Id, ip: string): Promise<{
        numAffected: number;
        affectedDocuments: import("@seald-io/nedb").Document<Record<string, any>> | import("@seald-io/nedb").Document<Record<string, any>>[] | null;
        upsert: boolean;
    }>;
    /**
     * @todo delete _id
     * @param data
     * @param from node_id
     */
    sync(data: Types.Node.Model[], from: Types.Node.Id): Promise<boolean>;
    /**
     *
     * @param node_id
     * @returns
     */
    getSync(node_id: Types.Node.Id): Promise<Record<string, any>[]>;
};
export default model;
