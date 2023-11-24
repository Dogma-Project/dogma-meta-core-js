import os from "node:os";
import { getArg } from "./arguments";
import { System } from "../types";

/**
 * @todo edit
 */
const prefix = getArg(System.Args.prefix);
export const dogmaDir = os.homedir() + "/.dogma-node";
export const datadir = dogmaDir + (prefix ? `/${prefix}` : "/default");
export const nedbDir = datadir + "/nedb";
export const keysDir = datadir + "/keys";
