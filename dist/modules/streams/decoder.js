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
const Types = __importStar(require("../../types"));
const constants_1 = require("../../constants");
class Decoder extends node_stream_1.EventEmitter {
    constructor(privateKey) {
        super();
        this.privateKey = privateKey;
    }
    decode(chunk) {
        try {
            const mx = chunk.subarray(0, constants_1.SIZES.MX).readUInt8(0);
            let data = chunk.subarray(constants_1.SIZES.MX, chunk.length);
            if (mx !== 1 /* Types.Streams.MX.handshake */) {
                if (!this.privateKey)
                    return;
                data = node_crypto_1.default.privateDecrypt(this.privateKey, data);
            }
            const result = {
                mx,
                data,
            };
            this.emit("data", result);
        }
        catch (err) {
            this.emit("error", err);
        }
    }
    setPrivateKey(privateKey) {
        this.privateKey = privateKey;
    }
}
exports.default = Decoder;
