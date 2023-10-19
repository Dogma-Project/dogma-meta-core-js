import { Node } from "./model";
import { Types } from "../types";
declare const sync: {
    handled: {
        messages: {
            getAll(type: number): Promise<any>;
            get({ id, since, type }: {
                id: string;
                since: number;
                type: number;
            }): Promise<any>;
            getStatus({ id, type }: {
                id: string;
                type: number;
            }): Promise<{
                text: any;
                from: any;
                newMessages: number;
            }>;
            push(params: any): Promise<any>;
            sync(data: any, from: any): Promise<boolean>;
            getSync(node_id: any): Promise<any>;
        };
        users: {
            getAll(): Promise<any>;
            persistUser(user: Types.User.Model): Promise<any>;
            removeUser(user_id: string): Promise<boolean>;
            sync(data: Types.User.Model[], from: string): Promise<boolean>;
        };
        nodes: {
            getAll(): Promise<any>;
            getByUserId(user_id: string): Promise<any>;
            persistNodes(nodes: Types.Node.Model[]): Promise<unknown>;
            setNodePublicIPv4(node_id: string, ip: string): Promise<any>;
            sync(data: Types.Node.Model[], from: string): Promise<boolean>;
            getSync(node_id: string): Promise<any>;
        };
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
