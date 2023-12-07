import { C_System } from "@dogma-project/constants-meta";
type value = string | number | boolean | null;
/**
 * @todo add parsed cache
 * @param type
 * @returns
 */
export declare function getArg(type: C_System.Args.auto): boolean | null;
export declare function getArg(type: C_System.Args.discovery): boolean | null;
export declare function getArg(type: C_System.Args.port): number | null;
export declare function getArg(type: C_System.Args.loglevel): number | null;
export declare function getArg(type: C_System.Args.prefix): string | null;
/**
 * @deprecated
 * @param type
 * @param value
 */
export declare function setArg(type: C_System.Args, value: value): void;
export {};
