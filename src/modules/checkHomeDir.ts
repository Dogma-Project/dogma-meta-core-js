import fs from "node:fs";
import getDatadir from "./datadir";
import { getArg } from "./arguments";
import { System } from "../types";

export default function checkHomeDir() {
  try {
    const dir = getDatadir();
    const prefix = getArg(System.Args.prefix);
    if (!prefix) return Promise.reject("Unknown home dir");
    if (prefix === "empty" || prefix.indexOf("test-") > -1) {
      fs.rmSync(dir.data, { recursive: true, force: true });
    }
    if (!fs.existsSync(dir.nedb)) fs.mkdirSync(dir.nedb, { recursive: true });
    if (!fs.existsSync(dir.keys)) fs.mkdirSync(dir.keys, { recursive: true });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
}
