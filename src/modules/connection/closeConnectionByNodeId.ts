import ConnectionClass from "../connections";
import logger from "../logger";
import * as Types from "../../types";

export default function closeConnecion(
  this: ConnectionClass,
  node_id: Types.Node.Id
) {
  try {
    const socket = this.getConnectionByNodeId(node_id);
    if (socket) socket.destroy();
  } catch (err) {
    logger.error("connection.js", "closeConnectionByNodeId", err);
  }
}
