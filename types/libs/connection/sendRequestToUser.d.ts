import { Types } from "../../types";
import ConnectionClass from "../connection";
/**
 *
 * @param {String} user_id user hash
 * @param {Object} request
 * @param {String} request.type
 * @param {String} request.action
 * @param {*} request.data optional
 * @returns {Promise} { id,code,message }
 */
export default function send(this: ConnectionClass, user_id: Types.User.Id, request: object): Promise<void>;
