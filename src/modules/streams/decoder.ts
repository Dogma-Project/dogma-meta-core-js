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
      let data = chunk.subarray(SIZES.MX, chunk.length);
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
