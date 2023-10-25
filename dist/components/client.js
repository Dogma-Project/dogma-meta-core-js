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
const client_1 = __importDefault(require("../modules/client"));
const connections_1 = __importDefault(require("./connections"));
const localDiscovery_1 = __importDefault(require("./localDiscovery"));
const logger_1 = __importDefault(require("../modules/logger"));
const dht_1 = __importDefault(require("./dht"));
const Types = __importStar(require("../types"));
const storage_1 = __importDefault(require("./storage"));
const state_1 = __importDefault(require("./state"));
const arguments_1 = __importDefault(require("../modules/arguments"));
const client = new client_1.default({ connections: connections_1.default, state: state_1.default, storage: storage_1.default });
localDiscovery_1.default.on("candidate", (data) => {
    const { type, user_id, node_id, local_ipv4 } = data;
    logger_1.default.log("client", "Local discovery candidate", data);
    if (type && type == "dogma-router" && user_id && node_id) {
        logger_1.default.log("nodes", "trying to connect local service", local_ipv4);
        const peer = connections_1.default.peerFromIP(local_ipv4);
        client.tryPeer(peer, { user_id, node_id });
    }
});
dht_1.default.on("peers", (data) => {
    data.forEach((item) => {
        const { public_ipv4, user_id, node_id } = item;
        const peer = connections_1.default.peerFromIP(public_ipv4);
        client.tryPeer(peer, { user_id, node_id });
    });
});
let connectFriendsInterval;
let searchFriendsInterval;
state_1.default.subscribe([21 /* Types.Event.Type.updateUser */, 3 /* Types.Event.Type.users */], () => {
    const user_id = state_1.default.state[21 /* Types.Event.Type.updateUser */];
    connections_1.default.closeConnectionsByUserId(user_id);
});
state_1.default.subscribe([2 /* Types.Event.Type.nodes */, 3 /* Types.Event.Type.users */, 5 /* Types.Event.Type.nodeKey */], () => {
    // eventEmitter.emit("friends", true);
    if (arguments_1.default.discovery)
        return; // don't lookup in discovery mode
    clearInterval(connectFriendsInterval);
    client.connectFriends(); // check
    connectFriendsInterval = setInterval(client.connectFriends, 60000); // edit
});
state_1.default.subscribe([
    13 /* Types.Event.Type.configDhtLookup */,
    3 /* Types.Event.Type.users */,
    5 /* Types.Event.Type.nodeKey */,
], () => {
    // edit
    if (arguments_1.default.discovery)
        return; // don't lookup in discovery mode
    clearInterval(searchFriendsInterval);
    if (storage_1.default.config.dhtLookup) {
        client.searchFriends(); // check
        searchFriendsInterval = setInterval(client.searchFriends, 30000); // edit
    }
});
