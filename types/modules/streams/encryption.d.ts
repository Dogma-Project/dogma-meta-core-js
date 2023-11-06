/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
type EncryptionStreamParams = {
    publicKey: crypto.KeyLike;
    opts?: internal.TransformOptions | undefined;
};
declare class Encryption extends Transform {
    publicKey: crypto.KeyLike;
    constructor(params: EncryptionStreamParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export default Encryption;
