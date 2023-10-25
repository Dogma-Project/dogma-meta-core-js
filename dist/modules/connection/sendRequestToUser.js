"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
function send(request, user_id) {
    try {
        const connections = this.getConnectionsByUserId(user_id);
        connections.forEach((connection) => {
            if (connection.node_id) {
                this.sendRequestToNode(request, connection.node_id);
            }
        });
    }
    catch (err) {
        logger_1.default.error("connection", "sendRequestToUser", err);
    }
}
exports.default = send;
