"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = exports.emit = exports.subscribe = exports.state = void 0;
const eventEmitter_1 = __importDefault(require("../components/eventEmitter"));
const logger_1 = __importDefault(require("./logger"));
const constants_1 = require("../constants");
exports.state = {};
const listeners = {};
const _services = {
    router: constants_1.STATES.DISABLED,
    masterKey: constants_1.STATES.DISABLED,
    nodeKey: constants_1.STATES.DISABLED,
    database: constants_1.STATES.DISABLED,
    dhtBootstrap: constants_1.STATES.DISABLED,
    dhtLookup: constants_1.STATES.DISABLED,
    dhtAnnounce: constants_1.STATES.DISABLED,
    localDiscovery: constants_1.STATES.DISABLED,
};
/** @module State */
/**
 *
 * @param type array of events
 * @param callback (action, value, type)
 */
const subscribe = (type, callback) => {
    type.forEach((key) => {
        if (listeners[key] === undefined)
            listeners[key] = [];
        listeners[key].push([type, callback]);
    });
};
exports.subscribe = subscribe;
/**
 *
 * @param type
 * @param payload Any payload | or Boolean "true" for forced emit
 */
const emit = (type, payload) => {
    let action = "update";
    if (listeners[type] === undefined)
        return logger_1.default.warn("state", "key isn't registered", type);
    if (exports.state[type] === undefined)
        action = "set";
    if (payload !== true) {
        if (JSON.stringify(exports.state[type]) === JSON.stringify(payload))
            return; // logger.warn("state", "nothing to emit", type);
        exports.state[type] = payload;
    }
    listeners[type].forEach((entry) => {
        if (!entry.length)
            return;
        let ready = entry[0].every((val) => exports.state[val] !== undefined);
        ready && entry[1](action, payload, type); // edit
    });
};
exports.emit = emit;
const servicesHandler = {
    get: (obj, prop) => {
        return obj[prop];
    },
    set: (obj, prop, value) => {
        if (obj[prop] === value)
            return true;
        obj[prop] = value;
        eventEmitter_1.default.emit("services", obj);
        return true;
    },
};
exports.services = new Proxy(_services, servicesHandler);
