"use strict";
const multiplex = require('multiplex');
const logger = require('../../logger');
const { MX } = require("../constants");
const { EncodeStream } = require("../streams");
const generateSyncId = require("../generateSyncId");
/**
 *
 * @param {Object} socket connection socket
 * @param {Object} peer
 * @param {String} peer.host
 * @param {Number} peer.port
 * @todo add and edit validaion for unauthorized
 */
module.exports = function (socket, peer) {
    const connection = this; // edit
    /**
     *
     * @param {Stream} writable
     * @return {Stream} transformable // check
     */
    const initEncoder = (writable) => {
        let encoder = new EncodeStream({ highWaterMark: connection.highWaterMark, descriptor: "0" }); // edit
        encoder.on("error", (err) => logger.error("encoder error", err));
        encoder.pipe(writable);
        return encoder;
    };
    const address = peer.host + ":" + peer.port;
    const connection_id = generateSyncId(6);
    logger.info("connection", "connected", connection_id, address, socket.authorized ? "authorized" : "non-authorized");
    socket.dogmaPlex = multiplex((stream, id) => {
        id = Number(id);
        // const decoder = new DecodeStream({ highWaterMark: connection.highWaterMark });
        stream.on("error", (err) => logger.error("connection", "stream decode error", err));
        stream.on("data", (data) => connection.onData({ socket, data, id }));
    });
    socket.multiplex = {};
    // substreams
    socket.multiplex.control = initEncoder(socket.dogmaPlex.createStream(MX.CONTROL));
    socket.multiplex.messages = initEncoder(socket.dogmaPlex.createStream(MX.MESSAGES));
    socket.multiplex.files = socket.dogmaPlex.createStream(MX.FILES);
    socket.multiplex.dht = initEncoder(socket.dogmaPlex.createStream(MX.DHT));
    // add more
    socket.dogmaPlex.pipe(socket);
    socket.pipe(socket.dogmaPlex);
    connection.peers[connection_id] = socket;
    // try {
    // 	const identity = socket.getCertificate(); // check
    // 	const user_id = identity.issuerCertificate.fingerprint256.toPlainHex();
    // 	const node_id = identity.fingerprint256.toPlainHex();
    // 	if (user_id !== store.user.id) return connection.reject(socket, "User IDs aren't equal", user_id, store.user.id)
    // 	if (node_id !== store.node.id) return connection.reject(socket, "Device IDs aren't equal", node_id, store.node.id);
    // } catch (err) {
    // 	return connection.reject(socket, "socket.getCertificate::", err);
    // }
    try {
        const peerIdentity = socket.getPeerCertificate(true);
        const user_id = peerIdentity.issuerCertificate.fingerprint256.toPlainHex();
        const node_id = peerIdentity.fingerprint256.toPlainHex();
        socket.dogma = {
            connection_id,
            address,
            user_id,
            node_id
        };
        connection.accept(socket);
    }
    catch (err) {
        return connection.reject(socket, "socket.getPeerCertificate::", err);
    }
};
