/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
type StreamDecoderParams = {
    id: number;
    privateKey?: crypto.KeyLike;
    opts?: internal.TransformOptions | undefined;
};
declare class Decoder extends Transform {
    id: number;
    privateKey?: crypto.KeyLike;
    constructor(params: StreamDecoderParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export default Decoder;
