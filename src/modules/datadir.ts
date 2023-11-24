import os from "node:os";
import { getArg } from "./arguments";
import { System } from "../types";

type datadir = {
  main: string;
  data: string;
  nedb: string;
  keys: string;
};

let switched = "";

export function getDatadir(): datadir {
  console.log("GET DATA DIR", switched);
  const prefix = switched || getArg(System.Args.prefix);
  const main = os.homedir() + "/.dogma-node";
  const data = main + `/${prefix}`;
  const nedb = data + "/nedb";
  const keys = data + "/keys";
  return { main, data, nedb, keys };
}

export function setDatadir(value: string) {
  console.log("SET DATA DIR", value, switched);
  if (!value.length) return;
  switched = value;
}
