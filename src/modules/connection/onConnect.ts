import net from "node:net";
import logger from "../logger";
import * as Types from "../../types";
import ConnectionClass from "../connections";
import DogmaSocket from "../socket";

export default function onConnect(
  this: ConnectionClass,
  socket: net.Socket,
  peer: Types.Connection.Peer, // check
  direction: Types.Connection.Direction = Types.Connection.Direction.outcoming
) {
  const dogmaSocket = new DogmaSocket(
    socket,
    direction,
    this.stateBridge,
    this.storageBridge
  );
  dogmaSocket.on("offline", () => {
    const { node_id } = dogmaSocket;
    if (!!node_id) {
      this.stateBridge.emit(Types.Event.Type.offline, node_id);
      const index = this.online.indexOf(node_id);
      if (index !== -1) {
        this.online.splice(index, 1);
        logger.info("connection", "OFFLINE", node_id);
      }
    }
  });
  dogmaSocket.on("online", () => {
    const { node_id } = dogmaSocket;
    if (!!node_id) {
      this.stateBridge.emit(Types.Event.Type.online, node_id);
      this.online.push(node_id);
      logger.info("connection", "ONLINE", node_id);
    }
  });
  dogmaSocket.on("data", (data: Types.Streams.DemuxedResult) => {
    const handler = this.handlers[data.mx];
    handler && handler(data.data, dogmaSocket, data.descriptor);
  });
  this.peers[dogmaSocket.id] = dogmaSocket;
  logger.info("connection", "connected", dogmaSocket.id, peer.address);
}
