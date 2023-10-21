import { Connection } from "../model";
import logger from "../logger";
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
export default async function send(
  this: ConnectionClass,
  user_id: Types.User.Id,
  request: object
) {
  try {
    const nodes = await Connection.getConnDataByUserId(user_id);
    nodes.forEach((node) => {
      this.sendRequestToNode(node.node_id, request, Types.Message.Type.user);
    });
  } catch (err) {
    logger.error("connection", "sendRequestToUser", err);
  }
}
