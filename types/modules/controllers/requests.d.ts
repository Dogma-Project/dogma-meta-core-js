import * as Types from "../../types";
/** @module RequestsController */
/**
 *
 * @param {Object} params
 * @param {String} params.node_id
 * @param {String} params.user_id
 * @param {Object} params.request
 * @param {String} params.request.type
 * @param {String} params.request.action
 * @param {Object} params.request.data
 */
declare const RequestsController: (node_id: Types.Node.Id, user_id: Types.User.Id, request: object) => void;
export default RequestsController;
