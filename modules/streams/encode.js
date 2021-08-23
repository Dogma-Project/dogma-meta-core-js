const { Transform } = require('stream');
  
class EncodeStream extends Transform { 

	constructor(opt) { // add out of range exception
		super(opt);
		this.descriptor = Buffer.allocUnsafe(2);
		this.descriptor.writeUInt16BE(opt.descriptor); 
	}

	_transform(chunk, _encoding, callback) {
		let result, error;
		try {
			result = Buffer.concat([this.descriptor, chunk], this.descriptor.length + chunk.length);
		} catch(err) {
			error = err;
		}
		callback(error, result);
	}

}

module.exports = EncodeStream;
