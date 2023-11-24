import os from "node:os";
import { getArg } from "./arguments";
import { System } from "../types";

type datadir = {
  main: string;
  data: string;
  nedb: string;
  keys: string;
};

export default function get(): datadir {
  const prefix = getArg(System.Args.prefix);
  const main = os.homedir() + "/.dogma-node";
  const data = main + (prefix ? `/${prefix}` : "/default");
  const nedb = data + "/nedb";
  const keys = data + "/keys";
  return { main, data, nedb, keys };
}
