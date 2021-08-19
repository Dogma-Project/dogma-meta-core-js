const { Transform } = require('stream');
  
class DogmaTransform extends Transform { 

	constructor(opt) { // add out of range exception
		super(opt);
		this.descriptor = Buffer.allocUnsafe(2);
		this.descriptor.writeUInt16BE(opt.descriptor); 
	}

	_transform(chunk, encoding, callback) {
		try {
			console.log("DT encoding", encoding);
			const result = Buffer.concat([this.descriptor, chunk], this.descriptor.length + chunk.length);
			callback(null, result);
		} catch (err) {
			callback(err);
		}
	}

}

module.exports = DogmaTransform;

// const counterTransform = new DogmaTransform({ highWaterMark: 2, descriptor: 25 });
