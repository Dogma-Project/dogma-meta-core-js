import { Node } from "../../libs/model";
import { Types } from "../../types";
declare const nodes: {
    /**
     *
     * @param {Object} params
     * @param {String} params.node_id
     * @param {Object} params.request
     * @param {String} params.request.type
     * @param {String} params.request.action
     * @param {Object} params.request.data
     */
    handleRequest(node_id: Types.Node.Id, request: object): Promise<void>;
};
export default nodes;
