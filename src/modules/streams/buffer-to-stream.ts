import { Buffer } from "node:buffer";
import stream from "node:stream";
import logger from "../logger";
import { Streams } from "../../types";

class BufferToStream extends stream.Readable {
  byte: number = 0;
  buffer: Buffer;
  chunkSize: number;

  constructor(params: Streams.BufferToStreamParams) {
    // add out of range exception
    super(params.opts);
    this.buffer = params.buffer;
    this.chunkSize = params.chunkSize;
  }

  _read() {
    if (this.byte >= this.buffer.length - 1) {
      this.push(null);
    } else {
      let part = this.buffer.slice(this.byte, this.byte + this.chunkSize);
      this.push(part);
      this.byte += this.chunkSize;
      logger.log("buffer-to-stream", "pushed", part.length, "bytes");
    }
  }
}

export default BufferToStream;
