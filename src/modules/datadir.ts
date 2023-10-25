import os from "node:os";
import args from "./arguments";

export const dogmaDir = os.homedir() + "/.dogma-node";
export const datadir =
  dogmaDir + (args.prefix ? `/${args.prefix}` : "/default");
export const nedbDir = datadir + "/nedb";
export const keysDir = datadir + "/keys";
