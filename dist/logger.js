"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = __importDefault(require("./modules/arguments"));
const constants_1 = require("./modules/constants");
/** @module Logger */
// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
/*
    log levels:
    0 - nothing
    1 - only errors
    2 - errors + debug
    3 - errors + debug + info
    4 - errors + debug + info + warnings
    5 - errors + debug + info + warnings + logs
*/
let logLevel = constants_1.DEFAULTS.LOG_LEVEL;
if (arguments_1.default.logLevel !== undefined) {
    logLevel = Number(arguments_1.default.logLevel) || 0;
}
console.log("LOG LEVEL:", logLevel);
/**
 *
 * @param type
 * @param message
 */
const dogmaError = (type, ...message) => {
    if (logLevel < constants_1.LOGLEVEL.ERRORS)
        return;
    type = type.toUpperCase();
    console.error(`\x1b[31m[${type}]\x1b[0m`, ...message); // red
};
/**
 *
 * @param type
 * @param message
 */
const dogmaDebug = (type, ...message) => {
    if (logLevel < constants_1.LOGLEVEL.DEBUG)
        return;
    type = type.toUpperCase();
    console.log(`\x1b[32m\x1b[40m[${type}]\x1b[0m`, ...message); //
};
/**
 *
 * @param type
 * @param message
 */
const dogmaInfo = (type, ...message) => {
    if (logLevel < constants_1.LOGLEVEL.INFO)
        return;
    type = type.toUpperCase();
    console.log(`\x1b[36m[${type}]\x1b[0m`, ...message); // blue
};
/**
 *
 * @param type
 * @param message
 */
const dogmaWarning = (type, ...message) => {
    if (logLevel < constants_1.LOGLEVEL.WARNINGS)
        return;
    type = type.toUpperCase();
    console.warn(`\x1b[33m[${type}]\x1b[0m`, ...message); // yellow
};
/**
 *
 * @param type
 * @param message
 */
const dogmaLog = (type, ...message) => {
    if (logLevel < constants_1.LOGLEVEL.LOGS)
        return;
    type = type.toUpperCase();
    console.log(`\x1b[37m\x1b[40m[${type}]\x1b[0m`, ...message); // black
};
const obj = {
    log: dogmaLog,
    warn: dogmaWarning,
    error: dogmaError,
    debug: dogmaDebug,
    info: dogmaInfo,
};
exports.default = obj;
module.exports = obj;
