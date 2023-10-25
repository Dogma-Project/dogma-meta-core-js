"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keysDir = exports.nedbDir = exports.datadir = exports.dogmaDir = void 0;
const node_os_1 = __importDefault(require("node:os"));
const arguments_1 = __importDefault(require("./arguments"));
exports.dogmaDir = node_os_1.default.homedir() + "/.dogma-node";
exports.datadir = exports.dogmaDir + (arguments_1.default.prefix ? `/${arguments_1.default.prefix}` : "/default");
exports.nedbDir = exports.datadir + "/nedb";
exports.keysDir = exports.datadir + "/keys";
