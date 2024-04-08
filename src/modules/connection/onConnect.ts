import net from "node:net";
import logger from "../logger";
import * as Types from "../../types";
import ConnectionClass from "../connections";
import DogmaSocket from "../socket";
import { C_Event } from "../../constants";
import { Connection } from "../../types";

export default function onConnect(
  this: ConnectionClass,
  socket: net.Socket,
  peer: Types.Connection.Peer,
  direction: Connection.Direction
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
      logger.warn("connection", "Unknown user or node id");
    }
  });

  /**
   * @todo add type
   */
  dogmaSocket.on("friendship", (data: any) => {
    let { user_id, user_name, node_id, node_name, peer, router_port } = data;
    if (router_port) {
      const addr = peer.address.split(":");
      addr[1] = router_port;
      peer = this.peerFromIP(addr.join(":"));
    }
    this.stateBridge.emit(C_Event.Type.friendshipRequest, {
      user_id,
      user_name,
      node_id,
      node_name,
      peer,
    });
  });

  dogmaSocket.on("data", (data: Types.Streams.DemuxedResult) => {
    const handler = this.handlers[data.mx];
    handler && handler(data.data, dogmaSocket, data.descriptor);
  });

  this.peers[dogmaSocket.id] = dogmaSocket;

  logger.info("connection", "connected", dogmaSocket.id);
}
