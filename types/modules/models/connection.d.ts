/**
 *
 * @param {Object} params
 * @param {String} params.connection_id
 * @param {String} params.user_id
 * @param {String} params.node_id
 * @param {String} params.address
 * @param {Boolean} params.authorized
 * @returns {Promise}
 */
export declare function push(params: {
    connection_id: string;
    user_id: string;
    node_id: string;
    address: string;
    authorized: boolean;
}): Promise<any>;
/**
 *
 * @param {String} connection_id
 */
declare function _delete(connection_id: string): Promise<any>;
export { _delete as delete };
/**
 * @todo add exceptions for non-loaded data
 * @returns {Promise}
 */
export declare function getConnections(): Promise<any>;
/**
 * @todo delete
 * @param {String} node_id
 */
export declare function isNodeOnline(node_id: string): Promise<any>;
/**
 *
 * @param {String} address host:port
 * @param {String} node_id node hash
 * @return {Promise}
 */
export declare function getConnectionsCount(address: string, node_id: string): Promise<any>;
/**
 *
 * @param {String} node_id node hash
 * @returns {Promise} object
 */
export declare function getConnDataByNodeId(node_id: string): Promise<any>;
/**
 *
 * @param {String} user_id user hash
 * @returns {Promise} array of objects
 */
export declare function getConnDataByUserId(user_id: string): Promise<any>;
/**
 *
 * @param {String} user_id
 * @returns {Promise}
 */
export declare function getUserOnlineNodes(user_id: string): Promise<any>;
