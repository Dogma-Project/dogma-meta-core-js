const { Transform } = require('stream');
const { DESCRIPTOR } = require("../constants");

class EncodeStream extends Transform {

	constructor(opt) { // add out of range exception
		super(opt);
		this.descriptor = Buffer.alloc(DESCRIPTOR.SIZE);
		this.descriptor.write(opt.descriptor); // test
	}

	_transform(chunk, _encoding, callback) {
		let result, error;
		try {
			result = Buffer.concat([this.descriptor, chunk], this.descriptor.length + chunk.length);
		} catch (err) {
			error = err;
		}
		callback(error, result);
	}

}

module.exports = EncodeStream;
