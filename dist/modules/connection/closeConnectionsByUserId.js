"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
function closeConnecion(user_id) {
    try {
        const connections = this.getConnectionsByUserId(user_id);
        connections.forEach((connection) => {
            connection.destroy();
        });
        // this.stateBridge.emit("update-user", false);
    }
    catch (err) {
        logger_1.default.error("connection.js", "closeConnectionsByUserId", err);
    }
}
exports.default = closeConnecion;
