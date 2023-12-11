import fs from "node:fs/promises";
import { getDatadir } from "../../modules/datadir";
import path from "node:path";

export default function DelPrefix(prefix: string) {
  const dir = getDatadir();
  return fs.rm(path.join(dir.main, prefix), {
    recursive: true,
  });
}
