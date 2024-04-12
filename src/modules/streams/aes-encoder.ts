import { stream, crypto, Buffer } from "@dogma-project/core-host-api";
import logger from "../logger";
import { C_Streams } from "../../constants";
import { Streams } from "../../types";

class AesEncoder extends stream.Transform {
  ss: Buffer;
  id: number;
  symmetricKey: Buffer;

  constructor(params: Streams.Encode.AESParams) {
    // add out of range exception
    super(params.opts);
    this.ss = Buffer.alloc(C_Streams.SIZES.MX, params.id);
    this.id = params.id;
    this.symmetricKey = params.symmetricKey;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: stream.TransformCallback
  ) {
    try {
      const iv = crypto.randomBytes(12); // move to constants
      const cipher = crypto.createCipheriv(
        "aes-256-gcm", // move to constants
        this.symmetricKey,
        iv
      );
      const encrypted = cipher.update(chunk);
      // check if need end();
      cipher.final();
      const authTag = cipher.getAuthTag();
      chunk = Buffer.concat(
        [encrypted, iv, authTag],
        encrypted.length + iv.length + authTag.length
      );
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
