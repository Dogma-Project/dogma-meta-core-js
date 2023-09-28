export function getAll(): Promise<any>;
/**
 *
 * @param {String} user_id
 * @returns {Promise}
 */
export function getByUserId(user_id: string): Promise<any>;
/**
 *
 * @param {Array} nodes [{name, node_id, user_id, public_ipv4, router_port}]
 * @returns {Promise}
 */
export function persistNodes(nodes: any[]): Promise<any>;
/**
 *
 * @param {String} node_id
 * @param {String} ip
 */
export function setNodePublicIPv4(node_id: string, ip: string): Promise<any>;
/**
 *
 * @param {Array} data
 * @param {String} from node_id
 */
export function sync(data: any[], from: string): Promise<boolean>;
/**
 *
 * @param {String} node_id
 * @returns
 */
export function getSync(node_id: string): Promise<any>;
