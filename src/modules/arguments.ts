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
  let result;
  let env = process.env[type];
  if (env === undefined) {
    const arg = args.find((item) => item.indexOf(`--${type}=`) > -1);
    if (arg) env = arg.split("=")[1];
  }
  if (env) {
    if (env === "true") {
      result = true;
    } else if (env === "false") {
      result = false;
    } else if (!Number.isNaN(Number(env))) {
      result = Number(env);
    }
    result = env;
  } else {
    result = null;
  }
  cache[type] = result;
  return result;
}

/**
 * @deprecated
 * @param type
 * @param value
 */
export function setArg(type: System.Args, value: value) {
  cache[type] = value;
}
