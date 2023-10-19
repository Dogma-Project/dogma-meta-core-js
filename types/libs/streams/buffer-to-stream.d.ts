/// <reference types="node" />
import { Readable } from "node:stream";
declare class BufferToStream extends Readable {
    /**
     *
     * @param {Object} opt
     * @param {Buffer} opt.buffer
     * @param {Number} opt.chunkSize
     */
    constructor(opt: any);
    _read(): void;
}
export default BufferToStream;
