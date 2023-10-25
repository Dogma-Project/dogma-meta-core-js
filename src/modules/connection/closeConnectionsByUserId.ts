import logger from "../logger";
import Connections from "../connections";
import * as Types from "../../types";

export default function closeConnecion(
  this: Connections,
  user_id: Types.User.Id
) {
  try {
    const connections = this.getConnectionsByUserId(user_id);
    connections.forEach((connection) => {
      connection.destroy();
    });
    // this.stateBridge.emit("update-user", false);
  } catch (err) {
    logger.error("connection.js", "closeConnectionsByUserId", err);
  }
}
