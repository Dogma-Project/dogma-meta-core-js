"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const node_crypto_1 = __importDefault(require("node:crypto"));
const logger_1 = __importDefault(require("../logger"));
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
            logger_1.default.error("encryption streamer", err);
            callback(null, null);
        }
    }
}
exports.default = Encryption;
