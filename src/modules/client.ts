import net from "node:net";
import logger from "./logger";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import Connections from "./connections";
import { C_Connection, C_Event, C_System } from "@dogma-project/constants-meta";

export default class Client {
  connectionsBridge: Connections;
  stateBridge: StateManager;
  storageBridge: Storage;

  constructor({
    connections,
    state,
    storage,
  }: {
    connections: Connections;
    state: StateManager;
    storage: Storage;
  }) {
    this.connectionsBridge = connections;
    this.stateBridge = state;
    this.storageBridge = storage;
  }

  private _connect(peer: Types.Connection.Peer) {
    try {
      const socket = net.connect(peer.port, peer.host, () => {
        this.connectionsBridge.onConnect(
          socket,
          peer,
          C_Connection.Direction.outcoming
        );
      });
      socket.on("error", (err: Error) => {
        // determine reason
        // logger.warn("CONNECT", err);
      });
    } catch (e) {
      logger.error("client", "Can't establish connection", e);
    }
  }

  /**
   *
   * @todo edit
   */
  tryPeer(
    peer: Types.Connection.Peer,
    node: { user_id: Types.User.Id; node_id: Types.Node.Id }
  ) {
    logger.log("Client", "Try peer", node.node_id);

    const server =
      this.stateBridge.get(C_Event.Type.server) || C_System.States.disabled;
    if (server < C_System.States.ok) {
      return logger.warn("Client", "Not ready to connect");
    }
    if (
      node.user_id === this.storageBridge.user.id &&
      node.node_id === this.storageBridge.node.id
    ) {
      return logger.warn("Client", "Prevent self connection");
    }

    const { user_id, node_id } = node;
    if (this.connectionsBridge.isNodeOnline(node_id)) {
      return logger.log("Client", "Peer already connected", node.node_id);
    }

    const authorized = this.connectionsBridge.isUserAuthorized(user_id);
    const connectNonFriends =
      this.connectionsBridge.allowDiscoveryRequests(
        C_Connection.Direction.outcoming
      ) || this.connectionsBridge.allowFriendshipRequests();

    if (!connectNonFriends) {
      if (!authorized) {
        return logger.log(
          "client",
          "tryPeer",
          user_id,
          "not in the friends list"
        );
      }
    }

    this._connect(peer);
  }

  test(peer: Types.Connection.Peer, cb: (result: boolean) => void) {
    try {
      logger.log("client", "TEST OWN SERVER", peer.address);

      const socket = net.connect({
        port: peer.port,
        host: peer.host,
        allowHalfOpen: false,
        noDelay: true,
        keepAlive: false,
      });

      socket.setTimeout(5000);
      socket.on("timeout", () => {
        if (socket.connecting) {
          logger.log("client", "TEST CONNECTION TIMEOUT");
          socket.destroy();
          return cb(false);
        } else {
          logger.warn("client", "TEST CONNECTION UNKNOWN BEHAVIOUR");
        }
      });
      socket.on("error", (error) => {
        logger.log("client", "TEST CONNECTION ERROR");
        cb(false);
      });
      socket.on("connect", () => {
        logger.log("client", "TEST CONNECTION SUCCESSFUL");
        socket.destroy();
        cb(true);
      });
    } catch (e) {
      logger.error("client.js", "test", "Can't establish connection", e);
    }
  }

  connectFriends(nodes: Types.Node.Model[]) {
    if (nodes.length) {
      logger.log("CLIENT", "Trying to connect friends", nodes.length);
      nodes.forEach((node) => {
        const { public_ipv4, local_ipv4, user_id, node_id } = node;
        if (public_ipv4) {
          // add validation
          const [host, port] = public_ipv4.split(":"); // edit!!!
          const peer: Types.Connection.Peer = {
            address: public_ipv4,
            host,
            port: Number(port),
            version: 4,
          };
          this.tryPeer(peer, { user_id, node_id });
        }
      });
    }
  }
}
