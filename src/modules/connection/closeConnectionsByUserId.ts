import { Connection } from "../model";
import logger from "../logger";
import ConnectionClass from "../connection";
import { Types } from "../../types";

export default async function closeConnecion(
  this: ConnectionClass,
  user_id: Types.User.Id
) {
  const { peers } = this;
  try {
    const result = await Connection.getConnDataByUserId(user_id);
    for (const row of result) {
      const socket = peers[row.connection_id];
      if (socket) {
        socket.destroy();
        // delete object
      }
    }
    this.stateBridge.emit("update-user", false);
  } catch (err) {
    logger.error("connection.js", "closeConnectionsByUserId", err);
  }
}
