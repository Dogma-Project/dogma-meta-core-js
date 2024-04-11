import fs from "node:fs";
import dir from "./datadir";

/**
 * @todo check!!!
 * @returns
 */
export default function checkHomeDir() {
  try {
    if (
      global.prefix.indexOf("empty-") > -1 ||
      global.prefix.indexOf("test-") > -1
    ) {
      fs.rmSync(dir.data, { recursive: true, force: true });
    }
    if (!fs.existsSync(dir.nedb)) fs.mkdirSync(dir.nedb, { recursive: true });
    if (!fs.existsSync(dir.keys)) fs.mkdirSync(dir.keys, { recursive: true });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
}
