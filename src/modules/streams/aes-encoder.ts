import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
import logger from "../logger";
import { C_Streams } from "@dogma-project/constants-meta";

type StreamEncoderParams = {
  id: number;
  symmetricKey: Buffer;
  opts?: internal.TransformOptions | undefined;
};

class AesEncoder extends Transform {
  ss: Buffer;
  id: number;
  symmetricKey: Buffer;

  constructor(params: StreamEncoderParams) {
    // add out of range exception
    super(params.opts);
    this.ss = Buffer.alloc(C_Streams.SIZES.MX, params.id);
    this.id = params.id;
    this.symmetricKey = params.symmetricKey;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        this.symmetricKey,
        iv
      );
      const encrypted = cipher.update(chunk);
      cipher.final();
      const authTag = cipher.getAuthTag();
      chunk = Buffer.concat(
        [encrypted, iv, authTag],
        encrypted.length + iv.length + authTag.length
      );
      // logger.debug(
      //   "ENCRYPT AES",
      //   "LENGTH ----------------->",
      //   encrypted.length,
      //   iv.length,
      //   authTag.length
      // );
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

export default AesEncoder;
