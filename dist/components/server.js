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
const connectionTester_1 = __importDefault(require("../modules/connectionTester"));
const server = new server_1.default({ connections: connections_1.default, storage: storage_1.default, state: state_1.default });
state_1.default.subscribe([20 /* Types.Event.Type.server */], (_action, state) => {
    state_1.default.services.router = state;
});
state_1.default.subscribe([
    20 /* Types.Event.Type.server */,
    16 /* Types.Event.Type.configAutoDefine */,
    17 /* Types.Event.Type.configExternal */,
    18 /* Types.Event.Type.configPublicIpV4 */,
], (_action, _state) => {
    const state = state_1.default.services.router;
    switch (state) {
        case 5 /* Types.System.States.limited */:
            (0, connectionTester_1.default)();
            break;
        case 7 /* Types.System.States.full */:
            state_1.default.emit(19 /* Types.Event.Type.externalPort */, storage_1.default.config.router);
            break;
    }
});
state_1.default.subscribe([
    12 /* Types.Event.Type.configRouter */,
    3 /* Types.Event.Type.users */,
    5 /* Types.Event.Type.nodeKey */,
    15 /* Types.Event.Type.configDhtBootstrap */,
], (_action, _value, _type) => {
    const port = storage_1.default.config.router;
    if (!state_1.default.services.router) {
        server.listen(port);
    }
    else {
        server.refresh(port);
    }
});
