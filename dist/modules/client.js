"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_net_1 = __importDefault(require("node:net"));
const logger_1 = __importDefault(require("./logger"));
/** @module Client */
class Client {
    constructor({ connections, state, storage, }) {
        this.connectionsBridge = connections;
        this.stateBridge = state;
        this.storageBridge = storage;
    }
    _connect(peer) {
        try {
            const socket = node_net_1.default.connect(peer.port, peer.host, () => {
                this.connectionsBridge.onConnect(socket, peer);
            });
        }
        catch (e) {
            logger_1.default.error("client", "Can't establish connection", e);
        }
    }
    /**
     *
     * @todo edit
     */
    tryPeer(peer, node) {
        const { user_id, node_id } = node;
        if (this.connectionsBridge.online.indexOf(node_id) > -1)
            return; // add to logs
        const connectNonFriends = true;
        if (!connectNonFriends) {
            const inFriends = this.storageBridge.users.find((user) => user.user_id === user_id);
            if (!inFriends)
                return logger_1.default.log("client", "tryPeer", user_id, "not in the friends list");
        }
        this._connect(peer);
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
                const peer = {
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
    dhtLookup(user_id) {
        // try {
        //   logger.log("client", "DHT LOOKUP", user_id);
        //   dht.lookup(user_id);
        // } catch (err) {
        //   logger.error("client", "DHT lookup error", err);
        // }
    }
}
exports.default = Client;
