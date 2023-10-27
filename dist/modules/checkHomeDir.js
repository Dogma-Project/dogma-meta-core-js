"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const datadir_1 = require("./datadir");
function checkHomeDir() {
    try {
        if (!node_fs_1.default.existsSync(datadir_1.nedbDir))
            node_fs_1.default.mkdirSync(datadir_1.nedbDir, { recursive: true });
        if (!node_fs_1.default.existsSync(datadir_1.keysDir))
            node_fs_1.default.mkdirSync(datadir_1.keysDir, { recursive: true });
        return Promise.resolve(true);
    }
    catch (err) {
        return Promise.reject(err);
    }
}
exports.default = checkHomeDir;
