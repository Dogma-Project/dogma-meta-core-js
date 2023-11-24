import fs from "node:fs";
import { getDatadir } from "./datadir";
import { getArg } from "./arguments";
import { System } from "../types";

export default function checkHomeDir() {
  try {
    const auto = getArg(System.Args.auto);
    const prefix = getArg(System.Args.prefix) || (auto ? "default" : null);
    if (!prefix) return Promise.reject(1);
    const dir = getDatadir();
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
