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
const node_net_1 = __importDefault(require("node:net"));
const logger_1 = __importDefault(require("./logger"));
const Types = __importStar(require("../types"));
/** @module Server */
class Server {
    constructor({ connections, state, storage, }) {
        this.ss = null;
        this.port = 0;
        this.connectionsBridge = connections;
        this.stateBridge = state;
        this.storageBridge = storage;
    }
    listen(port) {
        this.port = port;
        this.ss = node_net_1.default.createServer({}, (socket) => {
            const host = socket.remoteAddress || "127.0.0.1"; // edit
            const port = socket.remotePort || 0; // edit
            const peer = {
                host,
                port,
                address: host + ":" + port,
                version: 4,
            };
            this.connectionsBridge.onConnect(socket, peer);
        });
        const host = "0.0.0.0"; // temp
        this.ss.listen(port, host, () => {
            logger_1.default.info("server", `TCP socket is listening on ${host}:${port}`);
            /**
             * @todo move from here
             */
            /*
            setTimeout(() => {
              const {
                user: { id: user_id },
                node: { id: node_id },
              } = store;
              const card = {
                type: "dogma-router",
                user_id,
                node_id,
                port,
              };
              LocalDiscovery.announce(card);
              dht.announce(port);
            }, 3000);
            */
            this.stateBridge.emit("SERVER" /* Types.Event.Type.server */, 5 /* Types.System.States.limited */);
        });
        this.ss.on("error", (error) => {
            this.stateBridge.emit("SERVER" /* Types.Event.Type.server */, 0 /* Types.System.States.error */);
            logger_1.default.error("server", "SERVER ERROR", error);
        });
        this.ss.on("close", () => {
            logger_1.default.log("server", "SOCKET SERVER CLOSED");
        });
    }
    refresh(port) {
        this.stateBridge.emit("SERVER" /* Types.Event.Type.server */, 1 /* Types.System.States.disabled */);
        this.ss && this.ss.close();
        return this.listen(port);
    }
    start(port) {
        if (this.ss === null) {
            this.listen(port);
        }
        else if (port !== this.port) {
            this.refresh(port);
        }
        else {
            logger_1.default.info("Server", "start", "nothing to do");
        }
    }
}
exports.default = Server;
