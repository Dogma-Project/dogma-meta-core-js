"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_net_1 = __importDefault(require("node:net"));
const logger_1 = __importDefault(require("./logger"));
const store_1 = require("./store");
const state_1 = require("./state");
const constants_1 = require("../constants");
const model_1 = require("./model");
const dht_1 = __importDefault(require("../components/dht"));
/** @module Client */
class Client {
    constructor(connection) {
        this.connectionBridge = connection;
    }
    connect(peer) {
        try {
            // logger.debug("client", "connect", options);
            const socket = node_net_1.default.connect(peer.port, peer.host, () => {
                this.connectionBridge.onConnect(socket, peer);
            });
            socket.on("close", () => {
                this.connectionBridge.onClose(socket);
            });
            socket.on("error", (error) => {
                logger_1.default.log("client", "socket error", error);
            });
        }
        catch (e) {
            logger_1.default.error("client", "Can't establish connection", e);
        }
    }
    test(peer, cb) {
        try {
            const socket = node_net_1.default.connect(peer.port, peer.host, () => {
                logger_1.default.log("client", "TEST CONNECTION SUCCESSFUL");
                socket.destroy();
                cb(true);
            });
            socket.on("close", () => {
                logger_1.default.log("client", "TEST CONNECTION CLOSED");
            });
            socket.on("error", (error) => {
                logger_1.default.log("client", "TEST CONNECTION ERROR");
                cb(false);
            });
        }
        catch (e) {
            logger_1.default.error("client.js", "test", "Can't establish connection", e);
        }
    }
    permitUnauthorized() {
        const cond1 = state_1.state["config-dhtLookup"] == constants_1.DHTPERM.ALL;
        const cond2 = state_1.state["config-dhtAnnounce"] == constants_1.DHTPERM.ALL;
        return cond1 || cond2;
    }
    tryPeer(peer, from) {
        // check non-listed peers
        if (!peer || !peer.host || !peer.port)
            return logger_1.default.warn("nodes", "unknown peer", peer);
        if (!from || !from.user_id || !from.node_id)
            return logger_1.default.warn("nodes", "unknown from", from);
        const { user_id, node_id } = from;
        const { host, port } = peer;
        if (!this.permitUnauthorized()) {
            const inFriends = store_1.store.users.find((user) => user.user_id === user_id);
            // logger.debug("CLIENT", "tryPeer 1", inFriends, store.users, user_id);
            if (!inFriends)
                return logger_1.default.log("nodes", "tryPeer", user_id, "not in the friends list");
        }
        const address = host + ":" + port;
        model_1.Connection.getConnectionsCount(address, node_id)
            .then((count) => {
            if (count === 0)
                this.connect(peer);
        })
            .catch((err) => {
            logger_1.default.error("client", "tryPeer", err);
        });
    }
    getOwnNodes() {
        const user_id = store_1.store.user.id;
        return model_1.Node.getByUserId(user_id);
    }
    /**
     * DHT Lookup all friends
     */
    searchFriends() {
        store_1.store.users.forEach((user) => this.dhtLookup(user.user_id));
    }
    /**
     * Try to connect all nodes
     */
    connectFriends() {
        store_1.store.nodes.forEach((node) => {
            const { public_ipv4, router_port, user_id, node_id } = node;
            this.tryPeer({
                host: public_ipv4,
                port: router_port,
            }, {
                user_id,
                node_id,
            });
        });
    }
    dhtLookup(user_id) {
        try {
            logger_1.default.log("client", "DHT LOOKUP", user_id);
            dht_1.default.lookup(user_id);
        }
        catch (err) {
            logger_1.default.error("client", "DHT lookup error", err);
        }
    }
}
exports.default = Client;
