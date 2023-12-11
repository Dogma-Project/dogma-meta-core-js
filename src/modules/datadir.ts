import os from "node:os";
import path from "node:path";

type datadir = {
  main: string;
  data: string;
  nedb: string;
  keys: string;
};

export function getDatadir(): datadir {
  const main = path.join(os.homedir(), "/.dogma-node");
  const data = path.join(main, `/${global.prefix}`);
  const nedb = path.join(data, "/nedb");
  const keys = path.join(data, "/keys");
  return { main, data, nedb, keys };
}
