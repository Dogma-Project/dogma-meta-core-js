import { Connection } from "../../libs/model";
import logger from "../../libs/logger";
import { Types } from "../../types";
import ConnectionClass from "../connection";

export default async function send(
  this: ConnectionClass,
  user_id: Types.User.Id,
  message: Types.Message.Class.Abstract
) {
  // edit priority
  try {
    const nodes = await Connection.getConnDataByUserId(user_id);
    if (!nodes.length)
      return logger.warn("connection", "sendMessageToUser", "user is offline");
    const { node_id } = nodes[0]; // edit
    node_id &&
      this.sendMessageToNode(node_id, message, Types.Message.Type.user);
  } catch (err) {
    logger.error("connection", "sendMessageToUser", err);
  }
}
