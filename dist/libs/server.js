"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_net_1 = __importDefault(require("node:net"));
const logger_1 = __importDefault(require("./logger"));
const store_1 = require("./store");
const state_1 = require("./state");
const localDiscovery_1 = __importDefault(require("../components/localDiscovery"));
const dht_1 = __importDefault(require("../components/dht"));
const arguments_1 = __importDefault(require("../components/arguments"));
const constants_1 = require("../constants");
// import { Types } from "../types";
/** @module Server */
class Server {
    constructor(connection) {
        this.ss = null;
        this.port = 0;
        this.connectionBridge = connection;
    }
    listen(port) {
        this.port = port;
        this.ss = node_net_1.default.createServer({}, (socket) => {
            const peer = {
                host: socket.remoteAddress || "unk",
                port: socket.remotePort || 0,
            };
            this.connectionBridge.onConnect(socket, peer);
            socket.on("close", () => {
                this.connectionBridge.onClose(socket);
            });
            socket.on("error", (e) => {
                logger_1.default.warn("server", "socket server error 1", e);
            });
            // add onEnd
        });
        const host = "0.0.0.0"; // temp
        this.ss.listen(port, host, () => {
            logger_1.default.info("server", `TLS socket is listening on ${host}:${port}`);
            setTimeout(() => {
                const { user: { id: user_id }, node: { id: node_id }, } = store_1.store;
                const card = {
                    type: "dogma-router",
                    user_id,
                    node_id,
                    port,
                };
                localDiscovery_1.default.announce(card);
                dht_1.default.announce(port);
            }, 3000);
            (0, state_1.emit)("server", constants_1.STATES.LIMITED);
        });
        this.ss.on("error", (error) => {
            (0, state_1.emit)("server", constants_1.STATES.ERROR);
            logger_1.default.error("server", "SERVER ERROR", error);
        });
        this.ss.on("close", () => {
            logger_1.default.log("server", "SOCKET SERVER CLOSED");
        });
    }
    stop(cb) {
        (0, state_1.emit)("server", constants_1.STATES.DISABLED);
        this.ss && this.ss.close();
        cb();
    }
    refresh(port) {
        if (port !== this.port) {
            this.stop(() => {
                this.listen(port);
            });
        }
        else {
            console.log("do nothing");
            // this.ss && this.ss.setSecureContext(getOptions());
        }
    }
    /**
     * Allows unauthorized server connections
     * @returns {Boolean}
     * @todo check how args.discovery allows ALL permission
     */
    permitUnauthorized() {
        const cond1 = !!arguments_1.default.discovery;
        const cond2 = state_1.state["config-bootstrap"] == constants_1.DHTPERM.ALL;
        return cond1 || cond2;
    }
}
exports.default = Server;
