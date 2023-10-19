import os from "node:os";
import args from "./arguments";

export const dogmaDir = os.homedir() + "/.dogma-node";
export const datadir =
  dogmaDir + (args.prefix ? `/${args.prefix}` : "/default");
