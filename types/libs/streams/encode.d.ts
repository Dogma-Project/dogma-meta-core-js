/// <reference types="node" />
import { Transform } from "node:stream";
declare class EncodeStream extends Transform {
    constructor(opt: any);
    _transform(chunk: any, _encoding: any, callback: any): void;
}
export default EncodeStream;
