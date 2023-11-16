"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const node_crypto_1 = __importDefault(require("node:crypto"));
const logger_1 = __importDefault(require("../logger"));
const Types = __importStar(require("../../types"));
const constants_1 = require("../../constants");
class Encoder extends node_stream_1.Transform {
    constructor(params) {
        // add out of range exception
        super(params.opts);
        this.ss = Buffer.alloc(constants_1.SIZES.MX, params.id);
        this.id = params.id;
        this.publicKey = params.publicKey;
    }
    _transform(chunk, encoding, callback) {
        try {
            if (this.id !== 1 /* Types.Streams.MX.handshake */) {
                if (!this.publicKey)
                    return callback(Error("Public key not specified. Can't encrypt"), null);
                chunk = node_crypto_1.default.publicEncrypt(this.publicKey, chunk);
            }
            const len = Buffer.alloc(constants_1.SIZES.LEN, 0);
            len.writeUInt16BE(chunk.length);
            const result = Buffer.concat([this.ss, len, chunk], this.ss.length + len.length + chunk.length);
            callback(null, result);
        }
        catch (err) {
            // edit
            logger_1.default.error("Encoder Stream", err);
            callback(err, null);
        }
    }
}
exports.default = Encoder;
