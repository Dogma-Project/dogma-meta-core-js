import { EventEmitter } from "node:stream";
import crypto from "node:crypto";
import { Streams } from "../../types";

class Decoder extends EventEmitter {
  privateKey: crypto.KeyLike;

  constructor(privateKey: crypto.KeyLike) {
    super();
    this.privateKey = privateKey;
  }

  public decode(chunk: Buffer) {
    try {
      const mx = chunk.subarray(0, Streams.SIZES.MX).readUInt8(0);
      const len = chunk
        .subarray(Streams.SIZES.MX, Streams.SIZES.MX + Streams.SIZES.LEN)
        .readUInt16BE(0);
      const offset = Streams.SIZES.MX + Streams.SIZES.LEN;
      let data = chunk.subarray(offset, len + offset);
      if (len + offset !== chunk.length) {
        setTimeout(() => {
          this.decode(chunk.subarray(len + offset, chunk.length));
        }, 10);
      }
      if (mx !== Streams.MX.handshake) {
        if (!this.privateKey) return;
        data = crypto.privateDecrypt(this.privateKey, data);
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
