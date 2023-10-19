import { Types } from "../../types";
declare const model: {
    push(params: Types.Connection.Description): Promise<import("@seald-io/nedb").Document<Types.Connection.Description>>;
    delete(connection_id: Types.Connection.Id): Promise<number>;
    /**
     * @todo add exceptions for non-loaded data
     * @returns {Promise}
     */
    getConnections(): Promise<unknown>;
    /**
     * @todo delete
     */
    isNodeOnline(node_id: Types.Node.Id): Promise<any>;
    getConnectionsCount(address: string, node_id: Types.Node.Id): Promise<number>;
    getConnDataByNodeId(node_id: Types.Node.Id): Promise<Record<string, any>>;
    getConnDataByUserId(user_id: Types.User.Id): Promise<Record<string, any>[]>;
    getUserOnlineNodes(user_id: Types.User.Id): Promise<any[]>;
};
export default model;
