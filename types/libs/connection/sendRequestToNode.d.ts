import { Types } from "../../types";
import ConnectionClass from "../connection";
/**
 *
 * @param {String} node_id node hash
 * @param {Object} request
 * @param {String} request.type
 * @param {String} request.action
 * @param {*} request.data optional
 * @param {Number} type direct, user, chat
 * @returns {Promise} { id,code,message }
 */
export default function send(this: ConnectionClass, node_id: Types.Node.Id, request: object, type?: number): Promise<Types.Response.Main>;
