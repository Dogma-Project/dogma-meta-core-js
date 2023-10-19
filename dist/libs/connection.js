"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./connection/index");
/** @module Connection */
class Connection {
    constructor() {
        this.peers = {};
        this.online = [];
        this.encodedStream = null;
        this.decodedStream = null;
        this.messageEncoder = null;
        this.highWaterMark = 200000;
        this.accept = index_1.accept;
        this.reject = index_1.reject;
        this.sendMessageToNode = index_1.sendMessageToNode;
        this.sendMessageToUser = index_1.sendMessageToUser;
        this.sendRequestToNode = index_1.sendRequestToNode;
        this.sendRequestToUser = index_1.sendRequestToUser;
        this.streamToNode = index_1.streamToNode;
        this.sendRequest = index_1.sendRequest;
        this.sendMessage = index_1.sendMessage;
        this.onData = index_1.onData;
        this.onConnect = index_1.onConnect;
        this.onClose = index_1.onClose;
        this._online = index_1.online;
        this._offline = index_1.offline;
        this.closeConnectionByNodeId = index_1.closeConnectionByNodeId;
        this.closeConnectionsByUserId = index_1.closeConnectionsByUserId;
    }
}
/*
dht.setPeers(connection.peers); // edit
*/
exports.default = Connection;
