"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
function closeConnecion(node_id) {
    try {
        const socket = this.getConnectionByNodeId(node_id);
        if (socket)
            socket.destroy();
    }
    catch (err) {
        logger_1.default.error("connection.js", "closeConnectionByNodeId", err);
    }
}
exports.default = closeConnecion;
