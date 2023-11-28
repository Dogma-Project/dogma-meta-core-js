/// <reference types="node" />
/// <reference types="node" />
import internal, { Transform, TransformCallback } from "node:stream";
type StreamEncoderParams = {
    id: number;
    symmetricKey: Buffer;
    opts?: internal.TransformOptions | undefined;
};
declare class AesEncoder extends Transform {
    ss: Buffer;
    id: number;
    symmetricKey: Buffer;
    constructor(params: StreamEncoderParams);
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
}
export default AesEncoder;
