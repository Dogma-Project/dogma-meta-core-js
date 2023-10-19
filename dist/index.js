"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ee = exports.api = void 0;
require("./libs/prototypes");
require("./components/migration");
require("./libs/server");
require("./libs/client");
require("./libs/sync"); // edit
const api_1 = __importDefault(require("./libs/api"));
exports.api = api_1.default;
const eventEmitter_1 = __importDefault(require("./components/eventEmitter"));
exports.ee = eventEmitter_1.default;
