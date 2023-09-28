/**
 *
 * @param {Number} type
 */
export function getAll(type: number): Promise<any>;
/**
 *
 * @param {Object} params
 * @param {String} params.id
 * @param {Number} params.since timestamp (should implement)
 * @param {Number} params.type
 */
export function get({ id, since, type }: {
    id: string;
    since: number;
    type: number;
}): Promise<any>;
/**
 *
 * @param {Object} params
 * @param {String} params.id
 * @param {Number} params.type
 * @returns {Promise}
 */
export function getStatus({ id, type }: {
    id: string;
    type: number;
}): Promise<any>;
/**
 *
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.message
 * @param {String} params.sync_id
 * @param {Number} params.direction
 * @param {Number} params.format
 * @param {Number} params.type
 */
export function push(params: {
    id: string;
    message: string;
    sync_id: string;
    direction: number;
    format: number;
    type: number;
}): Promise<any>;
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
