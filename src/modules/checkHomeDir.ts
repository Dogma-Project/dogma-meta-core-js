import fs from "node:fs";
import { nedbDir, keysDir } from "./datadir";

export default function checkHomeDir() {
  try {
    if (!fs.existsSync(nedbDir)) fs.mkdirSync(nedbDir, { recursive: true });
    if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
}
