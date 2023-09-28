const tls = require("node:tls");
const logger = require("../logger");
const { store } = require("./store");
const { state, subscribe } = require("./state");
const connection = require("./connection");
const { DHTPERM } = require("./constants");
const { Node, Connection } = require("./model");
const dht = require("./dht");
const EventEmitter = require("./eventEmitter");
const LocalDiscovery = require("./localDiscovery");
const args = require("./arguments");

/** @module Client */

/**
 *
 * @returns {Object} {key, cert, ca, requestCert, rejectUnauthorized, checkServerIdentity, servername }
 */
const getOptions = () => {
  return {
    key: store.node.key,
    cert: store.node.cert,
    ca: store.ca,
    requestCert: true,
    rejectUnauthorized: !client.permitUnauthorized(),
    checkServerIdentity: () => {
      return null;
    },
    servername: undefined,
  };
};

const client = (module.exports = {
  /**
   *
   * @param {Object} peer
   * @param {String} peer.host ip
   * @param {Number} peer.port port
   */
  connect: (peer) => {
    try {
      // logger.debug("client", "connect", options);
      const socket = tls.connect(peer.port, peer.host, getOptions(), () => {
        if (client.permitUnauthorized() || socket.authorized) {
          if (socket.authorized) {
            logger.log(
              "client",
              "{connected}",
              "Connection authorized by a CA."
            );
          } else {
            logger.log(
              "client",
              "{connected}",
              "Connection didn't authorized by a CA."
            );
          }
          connection.onConnect(socket, peer);
        } else {
          return logger.log(
            "client",
            "Connection not authorized: " + socket.authorizationError
          );
        }
      });
      socket.on("close", () => {
        connection.onClose(socket);
      });
      socket.on("error", (error) => {
        logger.log(
          "client",
          "socket error",
          error.errno,
          error.address + ":" + error.port
        );
      });
    } catch (e) {
      logger.error("client", "Can't establish connection", e);
    }
  },

  /**
   *
   * @param {Object} peer
   * @param {String} peer.host ip
   * @param {Number} peer.port port
   * @param {Function} cb callback (result: Boolean)
   */
  test: (peer, cb) => {
    try {
      const socket = tls.connect(peer.port, peer.host, getOptions(), () => {
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
  },

  /**
   * Allows unauthorized client connections
   * @returns {Boolean}
   */
  permitUnauthorized: () => {
    const cond1 = state["config-dhtLookup"] == DHTPERM.ALL;
    const cond2 = state["config-dhtAnnounce"] == DHTPERM.ALL;
    return cond1 || cond2;
  },

  /**
   * @param {Object} peer
   * @param {String} peer.host IpAddr
   * @param {Number} peer.port Port
   * @param {Object} from
   * @param {String} from.user_id
   * @param {String} from.node_id
   * @todo add node_id connected status checker
   */
  tryPeer(peer, from) {
    // check non-listed peers

    if (!peer || !peer.host || !peer.port)
      return logger.warn("nodes", "unknown peer", peer);
    if (!from || !from.user_id || !from.node_id)
      return logger.warn("nodes", "unknown from", from);

    const { user_id, node_id } = from;
    const { host, port } = peer;

    if (!client.permitUnauthorized()) {
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
        if (count === 0) client.connect(peer);
      })
      .catch((err) => {
        logger.error("client", "tryPeer", err);
      });
  },

  /**
   *
   * @returns {Promise}
   */
  getOwnNodes: () => {
    const user_id = store.user.id;
    return Node.getByUserId(user_id);
  },

  /**
   * DHT Lookup all friends
   */
  searchFriends: () => {
    store.users.forEach((user) => client.dhtLookup(user.user_id));
  },

  /**
   * Try to connect all nodes
   */
  connectFriends: () => {
    store.nodes.forEach((node) => {
      const { public_ipv4, router_port, user_id, node_id } = node;
      client.tryPeer(
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
  },

  /**
   *
   * @param {String} user_id
   */
  dhtLookup: (user_id) => {
    try {
      logger.log("client", "DHT LOOKUP", user_id);
      dht.lookup(user_id);
    } catch (err) {
      logger.error("client", "DHT lookup error", err);
    }
  },
});

LocalDiscovery.on("message", (data) => {
  // validate
  const {
    msg: { type, user_id, node_id, port },
    from: { address },
  } = data;
  logger.log("client", "Local discovery candidate", data);
  if (type && type == "dogma-router" && user_id && node_id) {
    logger.log("nodes", "trying to connect local service", address);
    client.tryPeer(
      {
        host: address,
        port,
      },
      {
        user_id,
        node_id,
      }
    );
  }
});

dht.on("peers", (data) => {
  data.forEach((item) => {
    const { public_ipv4, port, user_id, node_id } = item;
    client.tryPeer(
      {
        host: public_ipv4,
        port,
      },
      {
        user_id,
        node_id,
      }
    );
  });
});

let connectFriendsInterval, searchFriendsInterval;

subscribe(["update-user", "users"], () => {
  const user_id = state["update-user"];
  connection.closeConnectionsByUserId(user_id);
});

subscribe(["nodes", "users", "nodes", "node-key"], () => {
  // edit
  EventEmitter.emit("friends", true);
  if (args.discovery) return; // don't lookup in discovery mode
  clearInterval(connectFriendsInterval);
  client.connectFriends(); // check
  connectFriendsInterval = setInterval(client.connectFriends, 60000); // edit
});

subscribe(["config-dhtLookup", "users", "node-key"], () => {
  // edit
  if (args.discovery) return; // don't lookup in discovery mode
  clearInterval(searchFriendsInterval);
  if (store.config.dhtLookup) {
    client.searchFriends(); // check
    searchFriendsInterval = setInterval(client.searchFriends, 30000); // edit
  }
});
