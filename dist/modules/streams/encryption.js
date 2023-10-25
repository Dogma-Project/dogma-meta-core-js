"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decryption = exports.Encryption = void 0;
const node_stream_1 = require("node:stream");
const node_crypto_1 = __importDefault(require("node:crypto"));
class Encryption extends node_stream_1.Transform {
    constructor(params) {
        super(params.opts);
        this.publicKey = params.publicKey;
    }
    _transform(chunk, encoding, callback) {
        try {
            const result = node_crypto_1.default.publicEncrypt(this.publicKey, chunk);
            callback(null, result);
        }
        catch (err) {
            console.error(err);
            callback(null, null);
        }
    }
}
exports.Encryption = Encryption;
class Decryption extends node_stream_1.Transform {
    constructor(params) {
        super(params.opts);
        this.privateKey = params.privateKey;
    }
    _transform(chunk, encoding, callback) {
        try {
            const result = node_crypto_1.default.privateDecrypt(this.privateKey, chunk);
            callback(null, result);
        }
        catch (err) {
            console.error(err);
            callback(null, null);
        }
    }
}
exports.Decryption = Decryption;
