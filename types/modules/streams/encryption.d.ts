/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
type EncryptionStreamParams = {
    publicKey: crypto.KeyLike;
    opts?: internal.TransformOptions | undefined;
};
type DecryptionStreamParams = {
    privateKey: crypto.KeyLike;
    opts?: internal.TransformOptions | undefined;
};
declare class Encryption extends Transform {
    publicKey: crypto.KeyLike;
    constructor(params: EncryptionStreamParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
declare class Decryption extends Transform {
    privateKey: crypto.KeyLike;
    constructor(params: DecryptionStreamParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export { Encryption, Decryption };
