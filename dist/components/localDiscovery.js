"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const localDiscovery_1 = __importDefault(require("../libs/localDiscovery"));
const logger_1 = __importDefault(require("../libs/logger"));
const state_1 = require("../libs/state");
const constants_1 = require("../constants");
const disc = new localDiscovery_1.default({
    port: constants_1.DEFAULTS.LOCAL_DISCOVERY_PORT,
    ip: "",
});
disc.startServer();
disc.on("ready", (data) => {
    state_1.services.localDiscovery = constants_1.STATES.FULL;
    logger_1.default.log("Local discovery server", "ready", data);
});
disc.on("error", (data) => {
    state_1.services.localDiscovery = constants_1.STATES.ERROR;
    logger_1.default.error("Local discovery server", "error", data);
});
exports.default = disc;
