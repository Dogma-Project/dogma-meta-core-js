/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
type MuxStreamParams = {
    substream: number;
    opts?: internal.TransformOptions | undefined;
};
type DemuxStreamParams = {
    opts?: internal.TransformOptions | undefined;
};
declare class MuxStream extends Transform {
    descriptor: Buffer;
    constructor(params: MuxStreamParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
declare class DemuxStream extends Transform {
    constructor(params: DemuxStreamParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export { MuxStream, DemuxStream };
