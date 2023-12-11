import fs from "node:fs/promises";
import { getDatadir } from "../../modules/datadir";

export default function GetPrefixes() {
  const dir = getDatadir();
  return fs
    .readdir(dir.main, {
      withFileTypes: true,
    })
    .then((dir) =>
      dir.filter((i) => {
        if (!i.isDirectory()) return false;
        if (i.name.indexOf("test-") > -1) return false;
        if (i.name.indexOf("empty-") > -1) return false;
        return true;
      })
    )
    .then((dir) => dir.map((i) => i.name));
}
