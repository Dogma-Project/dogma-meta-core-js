import internal, { Transform, TransformCallback } from "node:stream";
import { SIZES } from "../../constants";
import { Types } from "../../types";

type MuxStreamParams = {
  substream: number;
  opts?: internal.TransformOptions | undefined;
};

type DemuxStreamParams = {
  opts?: internal.TransformOptions | undefined;
};

class MuxStream extends Transform {
  descriptor: Buffer;

  constructor(params: MuxStreamParams) {
    // add out of range exception
    super(params.opts);
    this.descriptor = Buffer.alloc(1, params.substream);
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      const result = Buffer.concat(
        [this.descriptor, chunk],
        this.descriptor.length + chunk.length
      );
      callback(null, result);
    } catch (err) {
      console.error(err);
      callback(null, null);
    }
  }
}

class DemuxStream extends Transform {
  constructor(params: DemuxStreamParams) {
    super(params.opts);
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      const mx = chunk.subarray(0, SIZES.MX).readUInt8(0);
      const data = chunk.subarray(SIZES.MX, chunk.length);
      const result: Types.Streams.DemuxedResult = {
        mx,
        data,
      };
      callback(null, result);
    } catch (err) {
      console.error(err);
      callback(null, null);
    }
  }
}

export { MuxStream, DemuxStream };
