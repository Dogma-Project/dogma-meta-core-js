"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const logger_1 = __importDefault(require("../logger"));
class BufferToStream extends node_stream_1.Readable {
    constructor(params) {
        // add out of range exception
        super(params.opts);
        this.byte = 0;
        this.buffer = params.buffer;
        this.chunkSize = params.chunkSize;
    }
    _read() {
        if (this.byte >= this.buffer.length - 1) {
            this.push(null);
        }
        else {
            let part = this.buffer.slice(this.byte, this.byte + this.chunkSize);
            this.push(part);
            this.byte += this.chunkSize;
            logger_1.default.log("buffer-to-stream", "pushed", part.length, "bytes");
        }
    }
}
exports.default = BufferToStream;
