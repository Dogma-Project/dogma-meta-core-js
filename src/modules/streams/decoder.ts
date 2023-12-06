import { EventEmitter } from "node:stream";
import crypto from "node:crypto";
import { Streams } from "../../types";
import logger from "../logger";

class Decoder extends EventEmitter {
  private privateKey: crypto.KeyLike;
  public symmetricKey?: Buffer;

  private buffer: Buffer = Buffer.alloc(0);
  private decoding: boolean = false;

  constructor(privateKey: crypto.KeyLike) {
    super();
    this.privateKey = privateKey;
  }

  private decode() {
    if (this.buffer.length === 0) return;
    this.decoding = true;
    try {
      const mx = this.buffer.subarray(0, Streams.SIZES.MX).readUInt8(0);
      const offset = Streams.SIZES.MX + Streams.SIZES.LEN;
      const len = this.buffer
        .subarray(Streams.SIZES.MX, offset)
        .readUInt16BE(0);
      let packet = this.buffer.subarray(offset, len + offset);

      // skip if buffer is not full
      if (packet.length < len) {
        this.decoding = false;
        return logger.warn(
          "DECODE",
          "SMALL PACKET SIZE",
          packet.length,
          "EXPECTED:",
          len
        );
      }

      // remove packet from buffer
      this.buffer = this.buffer.subarray(
        packet.length + offset,
        this.buffer.length
      );

      let data: Buffer = Buffer.alloc(0);

      // decrypt
      if (mx === Streams.MX.key) {
        if (!this.privateKey) {
          this.decoding = false;
          return logger.warn("Decrypt", "Private key not ready");
        }
        data = crypto.privateDecrypt(this.privateKey, packet);
      } else if (mx === Streams.MX.handshake) {
        // plain
        data = packet;
      } else {
        if (!this.symmetricKey) {
          this.decoding = false;
          return logger.warn("Decrypt", "Symmetric key not ready");
        }
        const ivlen = 12;
        const atlen = 16;
        const metadata = packet.subarray(-ivlen + -atlen);
        const iv = metadata.subarray(0, ivlen);
        const authTag = metadata.subarray(-atlen);
        data = packet.subarray(0, -metadata.length);
        const decipher = crypto.createDecipheriv(
          "aes-256-gcm",
          this.symmetricKey,
          iv
        );
        decipher.setAuthTag(authTag);
        data = decipher.update(data);
        decipher.final();
      }

      this.decoding = false;
      this.decode();

      const result: Streams.DemuxedResult = {
        mx,
        data,
      };

      this.emit("data", result);
    } catch (err: any) {
      this.emit("error", err);
    }
  }

  public input(chunk: Buffer) {
    this.buffer = Buffer.concat(
      [this.buffer, chunk],
      this.buffer.length + chunk.length
    );
    if (!this.decoding) this.decode();
  }

  public setPrivateKey(privateKey: crypto.KeyLike) {
    this.privateKey = privateKey;
  }
}

export default Decoder;
