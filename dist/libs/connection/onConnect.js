"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multiplex = require("multiplex");
const logger_1 = __importDefault(require("../../libs/logger"));
const constants_1 = require("../../constants");
const streams_1 = require("../streams");
const generateSyncId_1 = __importDefault(require("../../libs/generateSyncId"));
function onConnect(socket, peer) {
    const connection = this; // edit
    /**
     *
     * @param {Stream} writable
     * @return {Stream} transformable // check
     */
    const initEncoder = (writable) => {
        let encoder = new streams_1.EncodeStream({
            highWaterMark: connection.highWaterMark,
            descriptor: "0",
        }); // edit
        encoder.on("error", (err) => logger_1.default.error("encoder error", err));
        encoder.pipe(writable);
        return encoder;
    };
    const address = peer.host + ":" + peer.port;
    const connection_id = (0, generateSyncId_1.default)(6);
    logger_1.default.info("connection", "connected", connection_id, address);
    const dogmaPlex = multiplex((stream, id) => {
        id = Number(id);
        // const decoder = new DecodeStream({ highWaterMark: connection.highWaterMark });
        stream.on("error", (err) => logger_1.default.error("connection", "stream decode error", err));
        stream.on("data", (data) => connection.onData({ socket, data, id }));
    });
    socket.multiplex = {};
    // substreams
    socket.multiplex.control = initEncoder(dogmaPlex.createStream(constants_1.MX.CONTROL));
    socket.multiplex.messages = initEncoder(dogmaPlex.createStream(constants_1.MX.MESSAGES));
    socket.multiplex.files = dogmaPlex.createStream(constants_1.MX.FILES);
    socket.multiplex.dht = initEncoder(dogmaPlex.createStream(constants_1.MX.DHT));
    // add more
    dogmaPlex.pipe(socket);
    socket.pipe(dogmaPlex);
    connection.peers[connection_id] = socket;
    try {
        const peerIdentity = socket.getPeerCertificate(true);
        const user_id = peerIdentity.issuerCertificate.fingerprint256.toPlainHex();
        const node_id = peerIdentity.fingerprint256.toPlainHex();
        socket.dogma = {
            connection_id,
            address,
            user_id,
            node_id,
        };
        connection.accept(socket);
    }
    catch (err) {
        return connection.reject(socket, "socket.getPeerCertificate::", err);
    }
}
exports.default = onConnect;
