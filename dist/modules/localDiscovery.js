"use strict";
const LocalDiscovery = require("../libs/localDiscovery");
const logger = require("../logger");
const { services } = require("./state");
const { DEFAULTS, STATES } = require("./constants");
const disc = new LocalDiscovery({
    port: DEFAULTS.LOCAL_DISCOVERY_PORT
});
disc.startServer();
disc.on("ready", (data) => {
    services.localDiscovery = STATES.FULL;
    logger.log("Local discovery server", "ready", data);
});
disc.on("error", (data) => {
    services.localDiscovery = STATES.ERROR;
    logger.error("Local discovery server", "error", data);
});
module.exports = disc;
