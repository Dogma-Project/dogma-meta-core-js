import { Message } from "./model";
import { User } from "./model";
import { Node } from "./model";
export namespace handled {
    export { Message as messages };
    export { User as users };
    export { Node as nodes };
}
export let state: never[];
/**
 *
 * @param {String} node_id
 * @param {String} type table name
 */
export function get(node_id: string, type: string): Promise<void>;
/**
 *
 * @param {String} node_id
 * @param {String} type
 * @param {Object} payload
 */
export function update(node_id: string, type: string, payload: Object): Promise<void>;
/**
 *
 * @param {Object} params
 * @param {Object} params.node_id node hash
 * @param {String} params.action get, update
 * @param {Object} params.data optional
 */
export function request({ node_id, action, data }: {
    node_id: Object;
    action: string;
    data: Object;
}): void;
/**
 *
 * @param {Object} params
 * @param {String} params.node_id
 * @param {String} params.user_id
 * @param {Object} params.request
 * @param {String} params.request.action get, update
 * @param {Object} params.request.data
 * @param {String} params.request.data.type table name
 * @param {Array} params.request.data.payload
 */
export function handleRequest({ node_id, user_id, request }: {
    node_id: string;
    user_id: string;
    request: {
        action: string;
        data: {
            type: string;
            payload: any[];
        };
    };
}): any;
