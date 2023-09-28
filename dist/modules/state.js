"use strict";
const EventEmitter = require("./eventEmitter");
const logger = require("../logger");
const { STATES } = require("./constants");
const state = {};
const listeners = [];
const services = {
    router: STATES.DISABLED,
    masterKey: STATES.DISABLED,
    nodeKey: STATES.DISABLED,
    database: STATES.DISABLED,
    dhtBootstrap: STATES.DISABLED,
    dhtLookup: STATES.DISABLED,
    dhtAnnounce: STATES.DISABLED,
    localDiscovery: STATES.DISABLED
};
/** @module State */
/**
 *
 * @param {Array} type array of events
 * @param {Function} callback (action, value, type)
 */
const subscribe = (type, callback) => {
    type.forEach((key) => {
        if (listeners[key] === undefined)
            listeners[key] = [];
        listeners[key].push([type, callback]);
    });
};
/**
 *
 * @param {String} type
 * @param {*} payload Any payload | or Boolean "true" for forced emit
 */
const emit = (type, payload) => {
    let action = 'update';
    if (listeners[type] === undefined)
        return logger.warn("state", "key isn't registered", type);
    if (state[type] === undefined)
        action = 'set';
    if (payload !== true) {
        if (JSON.stringify(state[type]) === JSON.stringify(payload))
            return; // logger.warn("state", "nothing to emit", type);
        state[type] = payload;
    }
    listeners[type].forEach((entry) => {
        let ready = entry[0].every((val) => (state[val] !== undefined));
        ready && entry[1](action, payload, type); // edit
    });
};
const servicesHandler = {
    get: (obj, prop) => {
        return obj[prop];
    },
    set: (obj, prop, value) => {
        if (obj[prop] === value)
            return true;
        obj[prop] = value;
        EventEmitter.emit("services", obj);
        return true;
    }
};
module.exports.state = state;
module.exports.subscribe = subscribe;
module.exports.emit = emit;
module.exports.services = new Proxy(services, servicesHandler);
