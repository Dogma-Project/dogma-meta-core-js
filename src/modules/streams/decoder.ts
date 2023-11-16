import { EventEmitter } from "node:stream";
import crypto from "node:crypto";
import * as Types from "../../types";
import { SIZES } from "../../constants";

class Decoder extends EventEmitter {
  privateKey: crypto.KeyLike;

  constructor(privateKey: crypto.KeyLike) {
    super();
    this.privateKey = privateKey;
  }

  public decode(chunk: Buffer) {
    try {
      const mx = chunk.subarray(0, SIZES.MX).readUInt8(0);
      const len = chunk
        .subarray(SIZES.MX, SIZES.MX + SIZES.LEN)
        .readUInt16BE(0);
      const offset = SIZES.MX + SIZES.LEN;
      let data = chunk.subarray(offset, len + offset);
      if (len + offset !== chunk.length) {
        setTimeout(() => {
          this.decode(chunk.subarray(len + offset, chunk.length));
        }, 10);
      }
      if (mx !== Types.Streams.MX.handshake) {
        if (!this.privateKey) return;
        data = crypto.privateDecrypt(this.privateKey, data);
      }
      const result: Types.Streams.DemuxedResult = {
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
