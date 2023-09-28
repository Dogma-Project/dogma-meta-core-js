export = EncodeStream;
declare class EncodeStream extends Transform {
    constructor(opt: any);
    descriptor: Buffer;
    _transform(chunk: any, _encoding: any, callback: any): void;
}
import { Transform } from "stream";
