import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";
import logger from "../logger";

type EncryptionStreamParams = {
  publicKey: crypto.KeyLike;
  opts?: internal.TransformOptions | undefined;
};

type DecryptionStreamParams = {
  privateKey: crypto.KeyLike;
  opts?: internal.TransformOptions | undefined;
};

class Encryption extends Transform {
  publicKey: crypto.KeyLike;

  constructor(params: EncryptionStreamParams) {
    super(params.opts);
    this.publicKey = params.publicKey;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      const result = crypto.publicEncrypt(this.publicKey, chunk);
      callback(null, result);
    } catch (err) {
      logger.error("encryption streamer", err);
      callback(null, null);
    }
  }
}

export default Encryption;
