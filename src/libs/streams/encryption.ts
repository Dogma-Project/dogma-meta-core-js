import internal, { Transform, TransformCallback } from "node:stream";
import crypto from "node:crypto";

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
      console.error(err);
      callback(null, null);
    }
  }
}

class Decryption extends Transform {
  privateKey: crypto.KeyLike;

  constructor(params: DecryptionStreamParams) {
    super(params.opts);
    this.privateKey = params.privateKey;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      const result = crypto.privateDecrypt(this.privateKey, chunk);
      callback(null, result);
    } catch (err) {
      console.error(err);
      callback(null, null);
    }
  }
}

export { Encryption, Decryption };
