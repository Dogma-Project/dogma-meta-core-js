import net from "node:net";
import logger from "./logger";
import { store } from "./store";
import { state } from "./state";
import ConnectionClass from "./connection";
import { DHTPERM } from "../constants";
import { Node, Connection } from "./model";
import dht from "../components/dht";
import { Types } from "../types";

/** @module Client */

export default class Client {
  connectionBridge: ConnectionClass;

  constructor(connection: ConnectionClass) {
    this.connectionBridge = connection;
  }

  connect(peer: Types.Connection.Peer) {
    try {
      // logger.debug("client", "connect", options);
      const socket: net.Socket = net.connect(peer.port, peer.host, () => {
        this.connectionBridge.onConnect(socket, peer);
      });
      socket.on("close", () => {
        this.connectionBridge.onClose(socket);
      });
      socket.on("error", (error) => {
        logger.log("client", "socket error", error);
      });
    } catch (e) {
      logger.error("client", "Can't establish connection", e);
    }
  }

  test(peer: Types.Connection.Peer, cb: (result: boolean) => void) {
    try {
      const socket = net.connect(peer.port, peer.host, () => {
        logger.log("client", "TEST CONNECTION SUCCESSFUL");
        socket.destroy();
        cb(true);
      });
      socket.on("close", () => {
        logger.log("client", "TEST CONNECTION CLOSED");
      });
      socket.on("error", (error) => {
        logger.log("client", "TEST CONNECTION ERROR");
        cb(false);
      });
    } catch (e) {
      logger.error("client.js", "test", "Can't establish connection", e);
    }
  }

  permitUnauthorized() {
    const cond1 = state["config-dhtLookup"] == DHTPERM.ALL;
    const cond2 = state["config-dhtAnnounce"] == DHTPERM.ALL;
    return cond1 || cond2;
  }

  tryPeer(
    peer: Types.Connection.Peer,
    from: { user_id: Types.User.Id; node_id: Types.Node.Id }
  ) {
    // check non-listed peers

    if (!peer || !peer.host || !peer.port)
      return logger.warn("nodes", "unknown peer", peer);
    if (!from || !from.user_id || !from.node_id)
      return logger.warn("nodes", "unknown from", from);

    const { user_id, node_id } = from;
    const { host, port } = peer;

    if (!this.permitUnauthorized()) {
      const inFriends = store.users.find((user) => user.user_id === user_id);
      // logger.debug("CLIENT", "tryPeer 1", inFriends, store.users, user_id);
      if (!inFriends)
        return logger.log(
          "nodes",
          "tryPeer",
          user_id,
          "not in the friends list"
        );
    }

    const address = host + ":" + port;
    Connection.getConnectionsCount(address, node_id)
      .then((count) => {
        if (count === 0) this.connect(peer);
      })
      .catch((err) => {
        logger.error("client", "tryPeer", err);
      });
  }
  getOwnNodes() {
    const user_id = store.user.id;
    return Node.getByUserId(user_id);
  }

  /**
   * DHT Lookup all friends
   */
  searchFriends() {
    store.users.forEach((user) => this.dhtLookup(user.user_id));
  }

  /**
   * Try to connect all nodes
   */
  connectFriends() {
    store.nodes.forEach((node) => {
      const { public_ipv4, router_port, user_id, node_id } = node;
      this.tryPeer(
        {
          host: public_ipv4,
          port: router_port,
        },
        {
          user_id,
          node_id,
        }
      );
    });
  }

  dhtLookup(user_id: Types.User.Id) {
    try {
      logger.log("client", "DHT LOOKUP", user_id);
      dht.lookup(user_id);
    } catch (err) {
      logger.error("client", "DHT lookup error", err);
    }
  }
}
