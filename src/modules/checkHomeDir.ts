import fs from "node:fs";
import { nedbDir, keysDir, datadir } from "./datadir";
import args from "./arguments";

export default function checkHomeDir() {
  try {
    if (args.prefix === "empty" || args.prefix === "test") {
      fs.rmSync(datadir, { recursive: true, force: true });
    }
    if (!fs.existsSync(nedbDir)) fs.mkdirSync(nedbDir, { recursive: true });
    if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
}
