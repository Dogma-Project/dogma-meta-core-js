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
const model_1 = require("./model");
const dht = new dht_1.default({
    state: state_1.default,
    storage: storage_1.default,
    connections: connections_1.default,
    model: model_1.dhtModel,
});
state_1.default.subscribe(["CONFIG DHT LOOKUP" /* Types.Event.Type.configDhtLookup */], (_action, value, _type) => {
    dht.setPermission(1 /* Types.DHT.Type.dhtLookup */, value);
    if (value > 3 /* Types.Connection.Group.selfUser */) {
        state_1.default.services.dhtLookup = 1 /* Types.System.States.disabled */;
    }
    else if (value === 1 /* Types.Connection.Group.all */) {
        state_1.default.services.dhtLookup = 7 /* Types.System.States.full */;
    }
    else {
        state_1.default.services.dhtLookup = 6 /* Types.System.States.ok */;
    }
});
state_1.default.subscribe(["CONFIG DHT ANNOUNCE" /* Types.Event.Type.configDhtAnnounce */], (_action, value, _type) => {
    dht.setPermission(0 /* Types.DHT.Type.dhtAnnounce */, value);
    if (value > 3 /* Types.Connection.Group.selfUser */) {
        state_1.default.services.dhtAnnounce = 1 /* Types.System.States.disabled */;
    }
    else if (value === 1 /* Types.Connection.Group.all */) {
        state_1.default.services.dhtAnnounce = 7 /* Types.System.States.full */;
    }
    else {
        state_1.default.services.dhtAnnounce = 6 /* Types.System.States.ok */;
    }
});
state_1.default.subscribe(["CONFIG DHT BOOTSTRAP" /* Types.Event.Type.configDhtBootstrap */], (_action, value, _type) => {
    dht.setPermission(2 /* Types.DHT.Type.dhtBootstrap */, value);
    if (value > 3 /* Types.Connection.Group.selfUser */) {
        state_1.default.services.dhtBootstrap = 1 /* Types.System.States.disabled */;
    }
    else if (value === 1 /* Types.Connection.Group.all */) {
        state_1.default.services.dhtBootstrap = 7 /* Types.System.States.full */;
    }
    else {
        state_1.default.services.dhtBootstrap = 6 /* Types.System.States.ok */;
    }
});
exports.default = dht;
