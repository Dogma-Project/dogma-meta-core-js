import { Readable } from "node:stream";
import logger from "../../libs/logger";

class BufferToStream extends Readable {
  /**
   *
   * @param {Object} opt
   * @param {Buffer} opt.buffer
   * @param {Number} opt.chunkSize
   */
  constructor(opt) {
    // add out of range exception
    super(opt);

    this.buffer = opt.buffer;
    this.chunkSize = opt.chunkSize;
    this.byte = 0;
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
