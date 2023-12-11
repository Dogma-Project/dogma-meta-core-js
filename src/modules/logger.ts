import { workerData } from "node:worker_threads";
import { C_System, C_Defaults } from "@dogma-project/constants-meta";

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

const logLevel = () => {
  return workerData.loglevel || C_Defaults.logLevel;
};

const prefix = () => {
  return global.prefix ? `${global.prefix}> ` : "";
};

/**
 * Red messages in console. Level 1.
 * @param type
 * @param message
 */
const dogmaError = (type: string, ...message: any) => {
  if (logLevel() < C_System.LogLevel.errors) return;
  type = type.toUpperCase();
  console.error(`${prefix()}\x1b[31m\x1b[40m[${type}]\x1b[0m`, ...message); // red
};

/**
 * Yellow messages in console. Level 2.
 * @param type
 * @param message
 */
const dogmaWarning = (type: string, ...message: any) => {
  if (logLevel() < C_System.LogLevel.warnings) return;
  type = type.toUpperCase();
  console.warn(`${prefix()}\x1b[33m\x1b[40m[${type}]\x1b[0m`, ...message); // yellow
};

/**
 * Green messages in console. Level 3.
 * @param type
 * @param message
 */
const dogmaInfo = (type: string, ...message: any) => {
  if (logLevel() < C_System.LogLevel.info) return;
  type = type.toUpperCase();
  console.info(`${prefix()}\x1b[32m\x1b[40m[${type}]\x1b[0m`, ...message); // blue
};

/**
 * Cyan messages in console. Level 4.
 * @param type
 * @param message
 */
const dogmaLog = (type: string, ...message: any) => {
  if (logLevel() < C_System.LogLevel.logs) return;
  type = type.toUpperCase();
  console.log(`${prefix()}\x1b[36m\x1b[40m[${type}]\x1b[0m`, ...message); // black
};

/**
 * Magenta messages in console. Level 4.
 * @param type
 * @param message
 */
const dogmaDebug = (type: string, ...message: any) => {
  if (logLevel() < C_System.LogLevel.debug) return;
  type = type.toUpperCase();
  console.debug(`${prefix()}\x1b[35m\x1b[40m[${type}]\x1b[0m`, ...message); //
};

// dogmaError("TEST", "Error color");
// dogmaWarning("TEST", "Warning color");
// dogmaInfo("TEST", "Info color");
// dogmaLog("TEST", "Log color");
// dogmaDebug("TEST", "Debug color");

const obj = {
  error: dogmaError,
  warn: dogmaWarning,
  info: dogmaInfo,
  log: dogmaLog,
  debug: dogmaDebug,
};

export default obj;
