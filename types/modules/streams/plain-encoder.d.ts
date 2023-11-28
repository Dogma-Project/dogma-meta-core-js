/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
type StreamEncoderParams = {
    id: number;
    opts?: internal.TransformOptions | undefined;
};
declare class PlainEncoder extends Transform {
    ss: Buffer;
    id: number;
    constructor(params: StreamEncoderParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export default PlainEncoder;
