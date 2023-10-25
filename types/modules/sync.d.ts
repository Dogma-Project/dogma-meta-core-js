import { Message, User, Node } from "./model";
import * as Types from "../types";
declare const sync: {
    handled: {
        messages: typeof Message;
        users: typeof User;
        nodes: typeof Node;
    };
    state: never[];
    /**
     *
     * @param {String} node_id
     * @param {String} type table name
     */
    get(node_id: Types.Node.Id, type: string): Promise<void>;
    update(node_id: Types.Node.Id, type: string, payload: object): Promise<void>;
    /**
     *
     * @param {Object} params
     * @param {Object} params.node_id node hash
     * @param {String} params.action get, update
     * @param {Object} params.data optional
     */
    request({ node_id, action, data }: {
        node_id: any;
        action: any;
        data: any;
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
    handleRequest({ node_id, user_id, request }: {
        node_id: any;
        user_id: any;
        request: any;
    }): void;
};
export default sync;
