"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferToStream = exports.EncodeStream = void 0;
const encode_1 = __importDefault(require("./encode"));
exports.EncodeStream = encode_1.default;
const buffer_to_stream_1 = __importDefault(require("./buffer-to-stream"));
exports.BufferToStream = buffer_to_stream_1.default;
