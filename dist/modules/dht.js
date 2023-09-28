"use strict";
const DHT = require("../libs/dht");
const { subscribe, services } = require("./state");
const { DHTPERM, STATES } = require("./constants");
const dht = module.exports = new DHT();
// add validation
subscribe(["config-dhtLookup"], (_action, value, _type) => {
    dht.setPermission("dhtLookup", value);
    if (value === DHTPERM.NOBODY) {
        services.dhtLookup = STATES.DISABLED;
    }
    else if (value === DHTPERM.ALL) {
        services.dhtLookup = STATES.FULL;
    }
    else {
        services.dhtLookup = STATES.OK;
    }
});
// add validation
subscribe(["config-dhtAnnounce"], (_action, value, _type) => {
    dht.setPermission("dhtAnnounce", value);
    if (value === DHTPERM.NOBODY) {
        services.dhtAnnounce = STATES.DISABLED;
    }
    else if (value === DHTPERM.ALL) {
        services.dhtAnnounce = STATES.FULL;
    }
    else {
        services.dhtAnnounce = STATES.OK;
    }
});
// add validation
subscribe(["config-bootstrap"], (_action, value, _type) => {
    dht.setPermission("dhtBootstrap", value);
    if (value === DHTPERM.NOBODY) {
        services.dhtBootstrap = STATES.DISABLED;
    }
    else if (value === DHTPERM.ALL) {
        services.dhtBootstrap = STATES.FULL;
    }
    else {
        services.dhtBootstrap = STATES.OK;
    }
});
