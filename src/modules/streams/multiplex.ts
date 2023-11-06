import internal, { Transform, TransformCallback } from "node:stream";

type MuxStreamParams = {
  substream: number;
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

export default MuxStream;
