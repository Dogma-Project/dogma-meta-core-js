"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const Types = __importStar(require("../../types"));
const socket_1 = __importDefault(require("../socket"));
function onConnect(socket, peer, // check
direction = Types.Connection.Direction.outcoming) {
    const dogmaSocket = new socket_1.default(socket, direction, this.stateBridge);
    dogmaSocket.on("offline", () => {
        const { node_id } = dogmaSocket;
        if (node_id !== null) {
            this.stateBridge.emit(Types.Event.Type.offline, node_id);
            const index = this.online.indexOf(node_id);
            if (index !== -1) {
                logger_1.default.log("connection", "OFFLINE", node_id);
                this.online.splice(index, 1);
            }
        }
    });
    dogmaSocket.on("online", () => {
        const { node_id } = dogmaSocket;
        if (node_id !== null) {
            this.stateBridge.emit(Types.Event.Type.online, node_id);
            this.online.push(node_id);
        }
    });
    this.peers[dogmaSocket.id] = dogmaSocket;
    logger_1.default.info("connection", "connected", dogmaSocket.id, peer.address);
}
exports.default = onConnect;
