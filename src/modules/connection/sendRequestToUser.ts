import logger from "../logger";
import * as Types from "../../types";
import Connections from "../connections";

export default function send(
  this: Connections,
  request: Types.Request,
  user_id: Types.User.Id
) {
  try {
    const connections = this.getConnectionsByUserId(user_id);
    connections.forEach((connection) => {
      if (connection.node_id) {
        this.sendRequestToNode(request, connection.node_id);
      }
    });
  } catch (err) {
    logger.error("connection", "sendRequestToUser", err);
  }
}
