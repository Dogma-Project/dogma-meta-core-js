import crypto from "node:crypto";
/**
 * handle exceptions
 * @param data
 * @returns
 */
export declare const createSha256Hash: (data: crypto.BinaryLike | string) => string;
