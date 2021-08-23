const { Transform } = require('stream');
  
class DecodeStream extends Transform { 

	constructor(opt) { // add out of range exception
		super(opt);
		this.descriptor = null;
	}

	_transform(chunk, _encoding, callback) {
		let result, error;
		try {
			const testSize = 2; // Buffer.allocUnsafe(2).length;
			if (!this.descriptor) this.descriptor = chunk.slice(0, testSize);
			result = chunk.slice(testSize);
		} catch (err) {
			error = err;
		}
		callback(error, result);
	}

}

module.exports = DecodeStream;
