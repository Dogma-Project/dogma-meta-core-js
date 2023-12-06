/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "node:stream";
import crypto from "node:crypto";
declare class Decoder extends EventEmitter {
    private privateKey;
    symmetricKey?: Buffer;
    private buffer;
    private decoding;
    constructor(privateKey: crypto.KeyLike);
    private decode;
    input(chunk: Buffer): void;
    setPrivateKey(privateKey: crypto.KeyLike): void;
}
export default Decoder;
