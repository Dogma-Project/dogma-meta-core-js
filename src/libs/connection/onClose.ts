import { emit } from "../state";
import { Connection } from "../../libs/model";
import logger from "../../libs/logger";
import ConnectionClass from "../connection";
import net from "node:net";
import { Types } from "../../types";

export default async function onClose(
  this: ConnectionClass,
  socket: net.Socket | Types.Connection.Socket
) {
  if (!("dogma" in socket)) {
    return logger.log("connection", "closed socket with unknown attr");
  }
  const { connection_id, node_id } = socket.dogma;
  emit("offline", node_id);
  this._offline(node_id);
  logger.info("connection", "closed", connection_id);
  try {
    await Connection.delete(connection_id);
    logger.log("connection", "successfully deleted connection", connection_id);
  } catch (err) {
    logger.error("connection", "can't delete connection", err);
  }
}
