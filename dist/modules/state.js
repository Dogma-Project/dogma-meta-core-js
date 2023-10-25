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
const Types = __importStar(require("../types"));
const logger_1 = __importDefault(require("./logger"));
class StateManager {
    constructor() {
        this._services = {
            router: 1 /* Types.System.States.disabled */,
            masterKey: 1 /* Types.System.States.disabled */,
            nodeKey: 1 /* Types.System.States.disabled */,
            database: 1 /* Types.System.States.disabled */,
            dhtBootstrap: 1 /* Types.System.States.disabled */,
            dhtLookup: 1 /* Types.System.States.disabled */,
            dhtAnnounce: 1 /* Types.System.States.disabled */,
            localDiscovery: 1 /* Types.System.States.disabled */,
        };
        this._servicesHandler = {
            get: (obj, prop) => {
                return obj[prop];
            },
            set: (obj, prop, value) => {
                if (obj[prop] === value)
                    return true;
                obj[prop] = value;
                // EventEmitter.emit("services", obj);
                return true;
            },
        };
        this.listeners = [];
        this.state = [];
        this.services = new Proxy(this._services, this._servicesHandler);
        /**
         *
         * @param type array of events
         * @param callback (action, value, type)
         */
        this.subscribe = (type, callback) => {
            type.forEach((key) => {
                if (this.listeners[key] === undefined)
                    this.listeners[key] = [];
                this.listeners[key].push([type, callback]);
            });
        };
        /**
         *
         * @param type
         * @param payload Any payload | or Boolean "true" for forced emit
         */
        this.emit = (type, payload) => {
            let action = 0 /* Types.Event.Action.update */;
            if (this.listeners[type] === undefined)
                return logger_1.default.warn("state", "key isn't registered", type);
            if (this.state[type] === undefined)
                action = 1 /* Types.Event.Action.set */;
            if (payload !== true) {
                if (JSON.stringify(this.state[type]) === JSON.stringify(payload))
                    return; // logger.warn("state", "nothing to emit", type);
                this.state[type] = payload;
            }
            this.listeners[type].forEach((entry) => {
                if (!entry.length)
                    return;
                let ready = entry[0].every((val) => this.state[val] !== undefined);
                ready && entry[1](action, payload, type); // edit
            });
        };
    }
}
exports.default = StateManager;
