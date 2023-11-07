/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "node:stream";
import crypto from "node:crypto";
declare class Decoder extends EventEmitter {
    privateKey: crypto.KeyLike;
    constructor(privateKey: crypto.KeyLike);
    decode(chunk: Buffer): void;
    setPrivateKey(privateKey: crypto.KeyLike): void;
}
export default Decoder;
