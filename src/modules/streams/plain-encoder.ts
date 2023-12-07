import internal, { Transform, TransformCallback } from "node:stream";
import logger from "../logger";
import { C_Streams } from "@dogma-project/constants-meta";

type StreamEncoderParams = {
  id: number;
  opts?: internal.TransformOptions | undefined;
};

class PlainEncoder extends Transform {
  ss: Buffer;
  id: number;

  constructor(params: StreamEncoderParams) {
    // add out of range exception
    super(params.opts);
    this.ss = Buffer.alloc(C_Streams.SIZES.MX, params.id);
    this.id = params.id;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      const len = Buffer.alloc(C_Streams.SIZES.LEN, 0);
      len.writeUInt16BE(chunk.length);
      const result = Buffer.concat(
        [this.ss, len, chunk],
        this.ss.length + len.length + chunk.length
      );
      callback(null, result);
    } catch (err: any) {
      logger.error("Encoder Stream", err);
      callback(err, null);
    }
  }
}

export default PlainEncoder;
