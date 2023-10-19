"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../libs/logger"));
const eventEmitter_1 = __importDefault(require("../../components/eventEmitter"));
function online(node_id) {
    logger_1.default.log("connection", "ONLINE", node_id);
    this.online.push(node_id);
    eventEmitter_1.default.emit("friends", true); // edit node_id
    eventEmitter_1.default.emit("connections", true); // edit connection_id
}
exports.default = online;
