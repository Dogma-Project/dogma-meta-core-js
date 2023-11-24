import fs from "node:fs";
import { getDatadir } from "./datadir";

export default function checkHomeDir(prefix: string) {
  if (!prefix) return Promise.reject(1);
  try {
    const dir = getDatadir(prefix);
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
