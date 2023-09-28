"use strict";
const { MESSAGES } = require("./constants");
const dht = require("./dht");
const { sendMessageToNode, sendRequestToNode, onConnect, onData, onClose, accept, reject, online, offline, closeConnectionByNodeId, closeConnectionsByUserId, sendRequestToUser, sendMessageToUser, streamToNode } = require("./connection/index");
/** @module Connection */
const connection = {
    peers: {},
    online: [],
    encodedStream: null,
    decodedStream: null,
    highWaterMark: 200000,
    messageEncoder: null,
    accept: accept,
    reject: reject,
    sendMessageToNode: sendMessageToNode,
    sendMessageToUser: sendMessageToUser,
    sendRequestToNode: sendRequestToNode,
    sendRequestToUser: sendRequestToUser,
    streamToNode: streamToNode,
    onData: onData,
    onConnect: onConnect,
    onClose: onClose,
    _online: online,
    _offline: offline,
    closeConnectionByNodeId: closeConnectionByNodeId,
    closeConnectionsByUserId: closeConnectionsByUserId,
    /**
     *
     * @param {String} to id
     * @param {Object} message
     * @param {Number} type
     */
    sendMessage: (to, message, type) => {
        switch (type) {
            case MESSAGES.DIRECT:
                return connection.sendMessageToNode(to, message);
                break;
            case MESSAGES.USER:
                return connection.sendMessageToUser(to, message);
                break;
            case MESSAGES.CHAT:
                // edit
                break;
        }
    },
    /**
     *
     * @param {String} to id
     * @param {Object} request
     * @param {Number} type
     */
    sendRequest: (to, request, type) => {
        switch (type) {
            case MESSAGES.DIRECT:
                return connection.sendRequestToNode(to, request);
                break;
            case MESSAGES.USER:
                return connection.sendRequestToUser(to, request);
                break;
            case MESSAGES.CHAT:
                // edit
                break;
        }
    },
};
// EventEmitter.on("file-buffer-complete", (payload) => {
// 	logger.log("connection", "file-buffer-complete", payload);
// });
dht.setPeers(connection.peers);
module.exports = connection;
