"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemuxStream = exports.MuxStream = void 0;
const node_stream_1 = require("node:stream");
const constants_1 = require("../../constants");
class MuxStream extends node_stream_1.Transform {
    constructor(params) {
        // add out of range exception
        super(params.opts);
        this.descriptor = Buffer.alloc(1, params.substream);
    }
    _transform(chunk, encoding, callback) {
        try {
            const result = Buffer.concat([this.descriptor, chunk], this.descriptor.length + chunk.length);
            callback(null, result);
        }
        catch (err) {
            console.error(err);
            callback(null, null);
        }
    }
}
exports.MuxStream = MuxStream;
class DemuxStream extends node_stream_1.Transform {
    constructor(params) {
        super(params.opts);
    }
    _transform(chunk, encoding, callback) {
        try {
            const mx = chunk.subarray(0, constants_1.SIZES.MX).readUInt8(0);
            const data = chunk.subarray(constants_1.SIZES.MX, chunk.length);
            const result = {
                mx,
                data,
            };
            callback(null, result);
        }
        catch (err) {
            console.error(err);
            callback(null, null);
        }
    }
}
exports.DemuxStream = DemuxStream;
