import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
import logger from "../logger";
import { C_Streams } from "../../types/constants";

type StreamEncoderParams = {
  id: number;
  publicKey: crypto.KeyLike;
  opts?: internal.TransformOptions | undefined;
};

class RsaEncoder extends Transform {
  ss: Buffer;
  id: number;
  publicKey: crypto.KeyLike;

  constructor(params: StreamEncoderParams) {
    // add out of range exception
    super(params.opts);
    this.ss = Buffer.alloc(C_Streams.SIZES.MX, params.id);
    this.id = params.id;
    this.publicKey = params.publicKey;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      chunk = crypto.publicEncrypt(this.publicKey, chunk);
      const len = Buffer.alloc(C_Streams.SIZES.LEN, 0);
      len.writeUInt16BE(chunk.length);
      const result = Buffer.concat(
        [this.ss, len, chunk],
        this.ss.length + len.length + chunk.length
      );
      callback(null, result);
    } catch (err: any) {
      // edit
      logger.error("Encoder Stream", err);
      callback(err, null);
    }
  }
}

export default RsaEncoder;
