"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../libs/logger"));
const eventEmitter_1 = __importDefault(require("../../components/eventEmitter"));
function offline(node_id) {
    const index = this.online.indexOf(node_id);
    if (index !== -1) {
        logger_1.default.log("connection", "OFFLINE", node_id);
        this.online.splice(index, 1);
        eventEmitter_1.default.emit("friends", true); // edit node_id
        eventEmitter_1.default.emit("connections", true); // edit connection_id
    }
}
exports.default = offline;
