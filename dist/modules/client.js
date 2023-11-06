"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_net_1 = __importDefault(require("node:net"));
const logger_1 = __importDefault(require("./logger"));
const Types = __importStar(require("../types"));
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
            const users = this.stateBridge.state["USERS" /* Types.Event.Type.users */];
            if (!users || !Array.isArray(users))
                return;
            const inFriends = users.find((user) => user.user_id === user_id);
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
        const users = this.stateBridge.state["USERS" /* Types.Event.Type.users */];
        if (users && Array.isArray(users)) {
            users.forEach((user) => this.dhtLookup(user.user_id));
        }
    }
    /**
     * @todo move to connections
     */
    connectFriends() {
        const nodes = this.stateBridge.state["NODES" /* Types.Event.Type.nodes */];
        if (nodes && Array.isArray(nodes)) {
            nodes.forEach((node) => {
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
