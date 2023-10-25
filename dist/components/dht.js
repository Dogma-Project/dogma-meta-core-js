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
const dht_1 = __importDefault(require("../modules/dht"));
const connections_1 = __importDefault(require("./connections"));
const state_1 = __importDefault(require("./state"));
const storage_1 = __importDefault(require("./storage"));
const Types = __importStar(require("../types"));
const dht = new dht_1.default({
    state: state_1.default,
    storage: storage_1.default,
    connections: connections_1.default,
});
state_1.default.subscribe([Types.Event.Type.configDhtLookup], (_action, value, _type) => {
    dht.setPermission(Types.DHT.Type.dhtLookup, value);
    if (value > Types.Connection.Group.selfUser) {
        state_1.default.services.dhtLookup = Types.System.States.disabled;
    }
    else if (value === Types.Connection.Group.all) {
        state_1.default.services.dhtLookup = Types.System.States.full;
    }
    else {
        state_1.default.services.dhtLookup = Types.System.States.ok;
    }
});
state_1.default.subscribe([Types.Event.Type.configDhtAnnounce], (_action, value, _type) => {
    dht.setPermission(Types.DHT.Type.dhtAnnounce, value);
    if (value > Types.Connection.Group.selfUser) {
        state_1.default.services.dhtAnnounce = Types.System.States.disabled;
    }
    else if (value === Types.Connection.Group.all) {
        state_1.default.services.dhtAnnounce = Types.System.States.full;
    }
    else {
        state_1.default.services.dhtAnnounce = Types.System.States.ok;
    }
});
state_1.default.subscribe([Types.Event.Type.configDhtBootstrap], (_action, value, _type) => {
    dht.setPermission(Types.DHT.Type.dhtBootstrap, value);
    if (value > Types.Connection.Group.selfUser) {
        state_1.default.services.dhtBootstrap = Types.System.States.disabled;
    }
    else if (value === Types.Connection.Group.all) {
        state_1.default.services.dhtBootstrap = Types.System.States.full;
    }
    else {
        state_1.default.services.dhtBootstrap = Types.System.States.ok;
    }
});
exports.default = dht;
