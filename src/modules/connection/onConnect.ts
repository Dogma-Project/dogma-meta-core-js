import net from "node:net";
import logger from "../logger";
import { Types } from "../../types";
import ConnectionClass from "../connection";
import DogmaSocket from "../socket";

export default function onConnect(
  this: ConnectionClass,
  socket: net.Socket,
  peer: Types.Connection.Peer, // edit
  direction: Types.Connection.Direction = Types.Connection.Direction.outcoming // edit
) {
  const address = peer.host + ":" + peer.port; // edit
  const dogmaSocket = new DogmaSocket(socket, direction);
  this.peers[dogmaSocket.id] = dogmaSocket;
  logger.info("connection", "connected", dogmaSocket.id, address);
}
