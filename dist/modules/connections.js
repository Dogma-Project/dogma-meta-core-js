"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./connection/index");
/** @module Connections */
class Connections {
    constructor({ state, storage }) {
        this.peers = {};
        this.online = [];
        this.encodedStream = null;
        this.decodedStream = null;
        this.messageEncoder = null;
        this.highWaterMark = 200000;
        this.sendRequestToNode = index_1.sendRequestToNode;
        this.sendRequestToUser = index_1.sendRequestToUser;
        // streamToNode = streamToNode;
        this.onConnect = index_1.onConnect;
        this.getConnectionByNodeId = index_1.getConnectionByNodeId;
        this.getConnectionsByUserId = index_1.getConnectionsByUserId;
        this.closeConnectionByNodeId = index_1.closeConnectionByNodeId;
        this.closeConnectionsByUserId = index_1.closeConnectionsByUserId;
        this.peerFromIP = index_1.peerFromIP;
        this.multicast = index_1.multicast;
        this.stateBridge = state;
        this.storageBridge = storage;
    }
}
/*
dht.setPeers(connection.peers); // edit
*/
exports.default = Connections;
