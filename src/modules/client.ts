import net from "node:net";
import logger from "./logger";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import Connections from "./connections";

/** @module Client */

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
        this.connectionsBridge.onConnect(socket, peer);
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
    const { user_id, node_id } = node;
    if (this.connectionsBridge.online.indexOf(node_id) > -1) return; // add to logs

    const connectNonFriends = true;

    if (!connectNonFriends) {
      const inFriends = this.storageBridge.users.find(
        (user) => user.user_id === user_id
      );
      if (!inFriends)
        return logger.log(
          "client",
          "tryPeer",
          user_id,
          "not in the friends list"
        );
    }

    this._connect(peer);
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

  /**
   * DHT Lookup all friends
   */
  searchFriends() {
    this.storageBridge.users.forEach((user) => this.dhtLookup(user.user_id));
  }

  /**
   * @todo move to connections
   */
  connectFriends() {
    this.storageBridge.nodes.forEach((node) => {
      const { public_ipv4, local_ipv4, user_id, node_id } = node;
      if (public_ipv4) {
        // add validation
        const [host, port] = public_ipv4;
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

  /**
   *
   * @todo move from here
   */
  dhtLookup(user_id: Types.User.Id) {
    // try {
    //   logger.log("client", "DHT LOOKUP", user_id);
    //   dht.lookup(user_id);
    // } catch (err) {
    //   logger.error("client", "DHT lookup error", err);
    // }
  }
}
