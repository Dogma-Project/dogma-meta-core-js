import { System } from "../types";
const args = process.argv.slice(2);

type value = string | number | boolean | null;

type Cache = {
  [key in System.Args]?: value;
};

const cache: Cache = {};

/**
 * @todo add parsed cache
 * @param type
 * @returns
 */
export function getArg(type: System.Args.auto): boolean | null;
export function getArg(type: System.Args.discovery): boolean | null;
export function getArg(type: System.Args.port): number | null;
export function getArg(type: System.Args.loglevel): number | null;
export function getArg(type: System.Args.prefix): string | null;
export function getArg(type: System.Args): value {
  const cached = cache[type];
  if (cached !== undefined) return cached;
  let env = process.env[type];
  if (env === undefined) {
    const arg = args.find((item) => item.indexOf(`--${type}=`) > -1);
    if (arg) env = arg.split("=")[1];
  }
  if (env) {
    if (env === "true") return true;
    if (env === "false") return false;
    if (!Number.isNaN(Number(env))) return Number(env);
    return env;
  } else {
    return null;
  }
}

export function setArg(type: System.Args, value: value) {
  cache[type] = value;
}
