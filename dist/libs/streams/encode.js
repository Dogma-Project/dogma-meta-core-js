"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const constants_1 = require("../../constants");
class EncodeStream extends node_stream_1.Transform {
    constructor(opt) {
        // edit
        // add out of range exception
        super(opt);
        this.descriptor = Buffer.alloc(constants_1.DESCRIPTOR.SIZE);
        this.descriptor.write(opt.descriptor); // test
    }
    _transform(chunk, _encoding, callback) {
        let result, error;
        try {
            result = Buffer.concat([this.descriptor, chunk], this.descriptor.length + chunk.length);
        }
        catch (err) {
            error = err;
        }
        callback(error, result);
    }
}
exports.default = EncodeStream;
