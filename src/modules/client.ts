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
    if (this.connectionsBridge.isNodeOnline(node_id)) return; // add to logs

    const connectNonFriends = true;

    if (!connectNonFriends) {
      const users = this.stateBridge.state[Types.Event.Type.users] as
        | Types.User.Model[]
        | undefined;
      if (!users || !Array.isArray(users)) return;
      const inFriends = users.find((user) => user.user_id === user_id);
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
      logger.debug("client", "TEST OWN SERVER", peer.address);

      const socket = net.connect({
        port: peer.port,
        host: peer.host,
        allowHalfOpen: false,
        noDelay: true,
        keepAlive: false,
      });

      socket.setTimeout(5000);
      socket.on("timeout", () => {
        console.log("socket timeout");
        if (socket.connecting) {
          logger.debug("client", "TEST CONNECTION TIMEOUT");
          socket.destroy();
          return cb(false);
        }
      });
      socket.on("error", (error) => {
        logger.debug("client", "TEST CONNECTION ERROR");
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

  /**
   * DHT Lookup all friends
   */
  searchFriends() {
    const users = this.stateBridge.state[Types.Event.Type.users] as
      | Types.User.Model[]
      | undefined;
    if (users && Array.isArray(users)) {
      logger.log("CLIENT", "Trying to search friends", users.length);
      users.forEach((user) => this.dhtLookup(user.user_id));
    }
  }

  /**
   * @todo move to connections
   */
  connectFriends() {
    const nodes = this.stateBridge.state[Types.Event.Type.nodes] as
      | Types.Node.Model[]
      | undefined;
    if (nodes && Array.isArray(nodes)) {
      logger.log("CLIENT", "Trying to connect friends", nodes.length);
      nodes.forEach((node) => {
        const { public_ipv4, local_ipv4, user_id, node_id } = node;
        if (public_ipv4) {
          // add validation
          const [host, port] = public_ipv4; // edit!!!
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
