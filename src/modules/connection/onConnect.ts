import net from "node:net";
import logger from "../logger";
import * as Types from "../../types";
import ConnectionClass from "../connections";
import DogmaSocket from "../socket";
import { C_Connection, C_Event } from "@dogma-project/constants-meta";

export default function onConnect(
  this: ConnectionClass,
  socket: net.Socket,
  peer: Types.Connection.Peer,
  direction: C_Connection.Direction
) {
  const dogmaSocket = new DogmaSocket(
    socket,
    direction,
    this,
    this.storageBridge
  );
  dogmaSocket.on("offline", () => {
    const { node_id } = dogmaSocket;
    if (!!node_id) {
      this.stateBridge.emit(C_Event.Type.offline, node_id);
      const index = this.online.indexOf(node_id);
      if (index !== -1) {
        this.online.splice(index, 1);
        logger.info("connection", "OFFLINE", node_id);
      }
    }
  });
  dogmaSocket.on("online", () => {
    const { user_id, node_id, user_name, node_name, status, group } =
      dogmaSocket;
    if (user_id && node_id) {
      if (this.online.indexOf(node_id) > -1) return; // check!!!
      this.stateBridge.emit(C_Event.Type.online, {
        user_id,
        node_id,
        user_name,
        node_name,
        status,
        group,
      });
      this.online.push(node_id);
      if (node_id !== this.storageBridge.node.id) {
        logger.info(
          "connection",
          "[ONLINE]",
          this.storageBridge.node.id,
          "->",
          node_id
        );
      }
    } else {
      dogmaSocket.destroy("Unknown user or node id");
    }
  });
  dogmaSocket.on("friendship", () => {
    const { user_id, user_name } = dogmaSocket; // add name
    this.stateBridge.emit(C_Event.Type.friendshipRequest, {
      user_id,
      user_name,
    });
  });
  dogmaSocket.on("data", (data: Types.Streams.DemuxedResult) => {
    const handler = this.handlers[data.mx];
    handler && handler(data.data, dogmaSocket, data.descriptor);
  });
  this.peers[dogmaSocket.id] = dogmaSocket;
  logger.info("connection", "connected", dogmaSocket.id, peer.address);
}
