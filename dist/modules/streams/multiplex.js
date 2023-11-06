"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
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
exports.default = MuxStream;
