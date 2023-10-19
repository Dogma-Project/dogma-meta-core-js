import logger from "../../libs/logger";
import { Connection } from "../../libs/model";
import { Types } from "../../types";
import ConnectionClass from "../connection";
import { emit } from "../state";
import { store } from "../store";

/**
 *
 * @param {Object} socket connection
 */
export default async function accept(
  this: ConnectionClass,
  socket: Types.Connection.Socket
) {
  let { connection_id, node_id, address, user_id, status } = socket.dogma;
  const mySelf = node_id === store.node.id;
  const own = user_id === store.user.id;

  /*
  if (mySelf) {
    // check
    address = address.replace(address.split(":")[1], store.config.router); // change to regular expressions
    logger.log("connection", "self connected", address);
  }
  */

  try {
    await Connection.push({
      connection_id,
      user_id,
      node_id,
      address,
      status,
    });
  } catch (err) {
    if (mySelf) return logger.log("connection", "skip self connection");
    return this.reject(socket, null); // temp
  }

  emit("online", { node_id, own, mySelf });
  this._online(node_id);
  logger.info(
    "accepted connection",
    node_id,
    address,
    `own: ${own}, mySelf: ${mySelf}`
  );
}
