export = BufferToStream;
declare class BufferToStream extends Readable {
    /**
     *
     * @param {Object} opt
     * @param {Buffer} opt.buffer
     * @param {Number} opt.chunkSize
     */
    constructor(opt: {
        buffer: Buffer;
        chunkSize: number;
    });
    buffer: Buffer;
    chunkSize: number;
    byte: number;
    _read(): void;
}
import { Readable } from "stream";
