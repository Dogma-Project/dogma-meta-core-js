export function getAll(): Promise<any>;
/**
 *
 * @param {Object} user
 * @param {String} user.name
 * @param {String} user.user_id
 * @param {String} user.cert
 * @param {Number} user.type
 * @returns {Promise}
 */
export function persistUser(user: {
    name: string;
    user_id: string;
    cert: string;
    type: number;
}): Promise<any>;
/**
 *
 * @param {String} user_id
 * @todo set to deleted state instead of remove
 */
export function removeUser(user_id: string): Promise<boolean>;
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
