import fs from "node:fs";
import { nedbDir, keysDir, datadir } from "./datadir";
import { getArg } from "./arguments";
import { System } from "../types";
import logger from "./logger";

export default function checkHomeDir() {
  try {
    const prefix = getArg(System.Args.prefix);
    if (!prefix) return Promise.reject("Unknown home dir");
    if (prefix === "empty" || prefix.indexOf("test-") > -1) {
      fs.rmSync(datadir, { recursive: true, force: true });
    }
    if (!fs.existsSync(nedbDir)) fs.mkdirSync(nedbDir, { recursive: true });
    if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
}
