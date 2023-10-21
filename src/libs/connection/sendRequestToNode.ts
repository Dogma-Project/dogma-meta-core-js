import { Connection } from "../../libs/model";
import { MSG_CODE } from "../../constants";
import logger from "../../libs/logger";
import { Types } from "../../types";
import ConnectionClass from "../connection";
import response from "./response";

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
export default async function send(
  this: ConnectionClass,
  node_id: Types.Node.Id,
  request: object,
  type: Types.Message.Type = Types.Message.Type.direct
) {
  try {
    const result = await Connection.getConnDataByNodeId(node_id);
    if (!result) return response(1, MSG_CODE.UNKNOWN, "user is offline"); // edit try catch
    const { connection_id } = result;
    const socket = this.peers[connection_id];
    // socket.multiplex.control.write(JSON.stringify(request));
    return response(1, MSG_CODE.SUCCESS);
  } catch (err) {
    logger.error("connection", "SEND TO NODE::", err);
    return response(1, MSG_CODE.ERROR, "can't send request"); // edit text
  }
}
