/// <reference types="node" />
/// <reference types="node" />
import internal, { Readable } from "node:stream";
type BufferToStreamParams = {
    buffer: Buffer;
    chunkSize: number;
    opts?: internal.ReadableOptions | undefined;
};
declare class BufferToStream extends Readable {
    byte: number;
    buffer: Buffer;
    chunkSize: number;
    constructor(params: BufferToStreamParams);
    _read(): void;
}
export default BufferToStream;
