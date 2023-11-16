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
const server_1 = __importDefault(require("../modules/server"));
const connections_1 = __importDefault(require("./connections"));
const state_1 = __importDefault(require("./state"));
const storage_1 = __importDefault(require("./storage"));
const Types = __importStar(require("../types"));
const logger_1 = __importDefault(require("../modules/logger"));
const client_1 = __importDefault(require("./client"));
const server = new server_1.default({ connections: connections_1.default, storage: storage_1.default, state: state_1.default });
state_1.default.subscribe([
    "SERVER" /* Types.Event.Type.server */,
    "CONFIG AUTO DEFINE" /* Types.Event.Type.configAutoDefine */,
    "CONFIG EXTERNAL" /* Types.Event.Type.configExternal */,
    // Types.Event.Type.configPublicIpV4,
], () => {
    const state = state_1.default.state["SERVER" /* Types.Event.Type.server */];
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", state);
    switch (state) {
        case 5 /* Types.System.States.limited */:
            const ipv4 = state_1.default.state["CONFIG PUBLIC IPV4" /* Types.Event.Type.configPublicIpV4 */] ||
                "145.145.145.145"; // edit
            const port = state_1.default.state["CONFIG ROUTER" /* Types.Event.Type.configRouter */] || 12345; // edit
            const peer = {
                host: ipv4,
                port,
                address: `${ipv4}:${port}`,
                public: true,
                version: 4,
            };
            client_1.default.test(peer, (res) => {
                if (res) {
                    state_1.default.emit("SERVER" /* Types.Event.Type.server */, 7 /* Types.System.States.full */);
                }
                else {
                    state_1.default.emit("SERVER" /* Types.Event.Type.server */, 6 /* Types.System.States.ok */);
                }
            });
            break;
        case 6 /* Types.System.States.ok */:
            logger_1.default.debug("Server", "!!!!!", "server is under NAT");
            break;
        case 7 /* Types.System.States.full */:
            state_1.default.emit("EXTERNAL PORT" /* Types.Event.Type.externalPort */, state_1.default.state["CONFIG ROUTER" /* Types.Event.Type.configRouter */]);
            break;
    }
});
state_1.default.subscribe([
    "CONFIG ROUTER" /* Types.Event.Type.configRouter */,
    "NODE KEY" /* Types.Event.Type.nodeKey */,
    "MASTER KEY" /* Types.Event.Type.masterKey */,
], () => {
    logger_1.default.log("DEBUG", "Server start");
    const port = state_1.default.state["CONFIG ROUTER" /* Types.Event.Type.configRouter */];
    server.start(port);
});
