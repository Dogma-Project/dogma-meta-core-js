import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
import logger from "../logger";
import * as Types from "../../types";

type StreamEncoderParams = {
  id: number;
  publicKey?: crypto.KeyLike;
  opts?: internal.TransformOptions | undefined;
};

class Encoder extends Transform {
  ss: Buffer;
  id: number;
  publicKey?: crypto.KeyLike;

  constructor(params: StreamEncoderParams) {
    // add out of range exception
    super(params.opts);
    this.ss = Buffer.alloc(1, params.id);
    this.id = params.id;
    this.publicKey = params.publicKey;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      if (this.id !== Types.Streams.MX.handshake) {
        if (!this.publicKey)
          return callback(
            Error("Public key not specified. Can't encrypt"),
            null
          );
        chunk = crypto.publicEncrypt(this.publicKey, chunk);
      }
      const result = Buffer.concat(
        [this.ss, chunk],
        this.ss.length + chunk.length
      );
      callback(null, result);
    } catch (err: any) {
      // edit
      logger.error("Encoder Stream", err);
      callback(err, null);
    }
  }
}

export default Encoder;
