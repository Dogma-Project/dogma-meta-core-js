"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
String.prototype.toPlainHex = function () {
    try {
        const value = this;
        return value.replace(/:/g, "").toLowerCase();
    }
    catch (err) {
        logger_1.default.error("prototypes", "toPlainHex", err);
        return null;
    }
};
Array.prototype.unique = function () {
    try {
        return this.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }
    catch (err) {
        logger_1.default.error("prototypes", "unique", err);
        return [];
    }
};
module.exports = { String, Array };
exports.default = { String, Array };
