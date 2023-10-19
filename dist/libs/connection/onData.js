"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const messages_1 = __importDefault(require("../../libs/messages"));
const files_1 = __importDefault(require("../controllers/files")); // move to dir
const requests_1 = __importDefault(require("../controllers/requests"));
const logger_1 = __importDefault(require("../../libs/logger"));
const dht_1 = __importDefault(require("../../components/dht"));
function onData(socket, data, id) {
    try {
        const descriptorBytes = data.slice(0, constants_1.DESCRIPTOR.SIZE);
        const descriptor = new TextDecoder().decode(descriptorBytes); // catch
        const decodedData = data.slice(constants_1.DESCRIPTOR.SIZE);
        const { node_id, user_id } = socket.dogma;
        let request;
        switch (id) {
            // text
            case constants_1.MX.CONTROL:
                if (!socket.authorized)
                    return logger_1.default.warn("connection", "unauthorized data", id);
                request = JSON.parse(decodedData.toString());
                (0, requests_1.default)({ node_id, user_id, request });
                break;
            case constants_1.MX.MESSAGES:
                if (!socket.authorized)
                    return logger_1.default.warn("connection", "unauthorized data", id);
                try {
                    const { text, files, type } = JSON.parse(decodedData.toString());
                    const filesData = files.map((file) => {
                        const { name, size, type, descriptor } = file;
                        return { name, size, type, descriptor };
                    });
                    messages_1.default.commit({
                        id: type === constants_1.MESSAGES.DIRECT ? node_id : user_id,
                        text,
                        files: filesData,
                        direction: constants_1.DIRECTION.INCOMING,
                        format: constants_1.MSG_FORMAT.COMMON,
                        type,
                    });
                }
                catch (err) {
                    logger_1.default.error("connection", "onData", "messages", err);
                }
                break;
            case constants_1.MX.FILES:
                if (!socket.authorized)
                    return logger_1.default.warn("connection", "unauthorized data", id);
                files_1.default.handleFile({
                    descriptor,
                    decodedData,
                    node_id,
                    user_id,
                });
                break;
            case constants_1.MX.DHT:
                request = JSON.parse(decodedData.toString());
                const public_ipv4 = socket.remoteAddress;
                const params = {
                    request,
                    from: {
                        user_id,
                        node_id,
                        public_ipv4,
                    },
                };
                dht_1.default.handleRequest(params, socket);
                break;
            default:
                if (!socket.authorized)
                    return logger_1.default.warn("connection", "unauthorized data", id);
                logger_1.default.warn("connection", "Unknown substream type", id);
                break;
        }
    }
    catch (err) {
        logger_1.default.error("connection", "onData", err);
    }
}
exports.default = onData;
