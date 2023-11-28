/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
type StreamEncoderParams = {
    id: number;
    publicKey: crypto.KeyLike;
    opts?: internal.TransformOptions | undefined;
};
declare class RsaEncoder extends Transform {
    ss: Buffer;
    id: number;
    publicKey: crypto.KeyLike;
    constructor(params: StreamEncoderParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export default RsaEncoder;
