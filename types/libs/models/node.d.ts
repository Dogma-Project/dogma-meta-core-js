import { Types } from "../../types";
declare const model: {
    getAll(): Promise<any>;
    /**
     *
     * @param user_id
     */
    getByUserId(user_id: Types.User.Id): Promise<any>;
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
    setNodePublicIPv4(node_id: Types.Node.Id, ip: string): Promise<any>;
    /**
     * @todo delete _id
     */
    sync(data: Types.Node.Model[], from: Types.Node.Id): Promise<boolean>;
    /**
     *
     * @param node_id
     * @returns
     */
    getSync(node_id: Types.Node.Id): Promise<any>;
};
export default model;
