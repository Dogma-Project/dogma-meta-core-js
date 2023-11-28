/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
type StreamEncoderParams = {
    id: number;
    publicKey?: crypto.KeyLike;
    symmetricKey?: Buffer;
    opts?: internal.TransformOptions | undefined;
};
declare class Encoder extends Transform {
    ss: Buffer;
    id: number;
    publicKey?: crypto.KeyLike;
    symmetricKey?: Buffer;
    constructor(params: StreamEncoderParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export default Encoder;
