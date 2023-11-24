import { System } from "../types";
type value = string | number | boolean | null;
/**
 * @todo add parsed cache
 * @param type
 * @returns
 */
export declare function getArg(type: System.Args.auto): boolean | null;
export declare function getArg(type: System.Args.discovery): boolean | null;
export declare function getArg(type: System.Args.port): number | null;
export declare function getArg(type: System.Args.loglevel): number | null;
export declare function getArg(type: System.Args.prefix): string | null;
export declare function setArg(type: System.Args, value: value): void;
export {};
