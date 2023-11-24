import os from "node:os";
import { getArg } from "./arguments";
import { System } from "../types";

type datadir = {
  main: string;
  data: string;
  nedb: string;
  keys: string;
  prefix: string;
};

/**
 * @todo add cache
 * @param prefix
 * @returns
 */
export function getDatadir(prefix: string): datadir {
  const main = os.homedir() + "/.dogma-node";
  const data = main + `/${prefix}`;
  const nedb = data + "/nedb";
  const keys = data + "/keys";
  return { main, data, nedb, keys, prefix };
}
