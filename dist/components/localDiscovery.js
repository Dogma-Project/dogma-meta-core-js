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
const localDiscovery_1 = __importDefault(require("../modules/localDiscovery"));
const logger_1 = __importDefault(require("../modules/logger"));
const state_1 = __importDefault(require("./state"));
const constants_1 = require("../constants");
const Types = __importStar(require("../types"));
const disc = new localDiscovery_1.default({
    port: constants_1.DEFAULTS.LOCAL_DISCOVERY_PORT,
    ip: "",
});
disc.startServer();
disc.on("ready", (data) => {
    state_1.default.services.localDiscovery = Types.System.States.full;
    logger_1.default.log("Local discovery server", "ready", data);
});
disc.on("error", (data) => {
    state_1.default.services.localDiscovery = Types.System.States.error;
    logger_1.default.error("Local discovery server", "error", data);
});
exports.default = disc;
