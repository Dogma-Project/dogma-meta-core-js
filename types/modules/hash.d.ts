import crypto from "node:crypto";
export declare const createSha1Hash: (data: crypto.BinaryLike | string) => string;
export declare const createSha256Hash: (data: crypto.BinaryLike | string) => string;
export declare const signSha256Hash: (data: string, privateKey: crypto.KeyLike) => string | null;
export declare const verifySha256Hash: (data: string, publicKey: crypto.KeyLike, sign: string) => boolean | null;
