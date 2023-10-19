"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dht_1 = __importDefault(require("../libs/dht"));
const state_1 = require("../libs/state");
const constants_1 = require("../constants");
const dht = new dht_1.default();
// add validation
(0, state_1.subscribe)(["config-dhtLookup"], (_action, value, _type) => {
    dht.setPermission("dhtLookup", value);
    if (value === constants_1.DHTPERM.NOBODY) {
        state_1.services.dhtLookup = constants_1.STATES.DISABLED;
    }
    else if (value === constants_1.DHTPERM.ALL) {
        state_1.services.dhtLookup = constants_1.STATES.FULL;
    }
    else {
        state_1.services.dhtLookup = constants_1.STATES.OK;
    }
});
// add validation
(0, state_1.subscribe)(["config-dhtAnnounce"], (_action, value, _type) => {
    dht.setPermission("dhtAnnounce", value);
    if (value === constants_1.DHTPERM.NOBODY) {
        state_1.services.dhtAnnounce = constants_1.STATES.DISABLED;
    }
    else if (value === constants_1.DHTPERM.ALL) {
        state_1.services.dhtAnnounce = constants_1.STATES.FULL;
    }
    else {
        state_1.services.dhtAnnounce = constants_1.STATES.OK;
    }
});
// add validation
(0, state_1.subscribe)(["config-bootstrap"], (_action, value, _type) => {
    dht.setPermission("dhtBootstrap", value);
    if (value === constants_1.DHTPERM.NOBODY) {
        state_1.services.dhtBootstrap = constants_1.STATES.DISABLED;
    }
    else if (value === constants_1.DHTPERM.ALL) {
        state_1.services.dhtBootstrap = constants_1.STATES.FULL;
    }
    else {
        state_1.services.dhtBootstrap = constants_1.STATES.OK;
    }
});
exports.default = dht;
