import { EventEmitter } from "node:stream";
import crypto from "node:crypto";
import { Streams } from "../../types";
import logger from "../logger";

class Decoder extends EventEmitter {
  private privateKey: crypto.KeyLike;
  public symmetricKey?: Buffer;

  constructor(privateKey: crypto.KeyLike) {
    super();
    this.privateKey = privateKey;
  }

  public decode(chunk: Buffer) {
    try {
      const mx = chunk.subarray(0, Streams.SIZES.MX).readUInt8(0);
      logger.debug("DECRYPT", "MX", mx);
      const len = chunk
        .subarray(Streams.SIZES.MX, Streams.SIZES.MX + Streams.SIZES.LEN)
        .readUInt16BE(0);
      const offset = Streams.SIZES.MX + Streams.SIZES.LEN;
      let data = chunk.subarray(offset, len + offset);
      if (len + offset !== chunk.length) {
        setTimeout(() => {
          this.decode(chunk.subarray(len + offset, chunk.length));
        }, 1);
      }
      if (mx === Streams.MX.key) {
        if (!this.privateKey) {
          return logger.warn("Decrypt", "Private key not ready");
        }
        data = crypto.privateDecrypt(this.privateKey, data);
      } else if (mx !== Streams.MX.handshake) {
        // decrypt symmetric
        if (!this.symmetricKey) {
          return logger.warn("Decrypt", "Symmetric key not ready");
        }
        logger.debug("DECRYPT", "DATA", data.length);
        const ivlen = 12;
        const atlen = 16;
        const metadata = data.subarray(-ivlen + -atlen);
        const iv = metadata.subarray(0, ivlen);
        const authTag = metadata.subarray(-atlen);
        data = data.subarray(0, -metadata.length);
        logger.debug("DECRYPT", "IV", iv.length, authTag.length, data.length);
        const decipher = crypto.createDecipheriv(
          "aes-256-gcm",
          this.symmetricKey,
          iv
        );
        decipher.setAuthTag(authTag);
        data = decipher.update(data);
        decipher.final();
      }
      const result: Streams.DemuxedResult = {
        mx,
        data,
      };
      this.emit("data", result);
    } catch (err: any) {
      this.emit("error", err);
    }
  }

  public setPrivateKey(privateKey: crypto.KeyLike) {
    this.privateKey = privateKey;
  }
}

export default Decoder;
