const { Readable } = require('stream');
  
class BufferToStream extends Readable { 

	constructor(opt) { // add out of range exception
		super(opt);

		this.buffer = opt.buffer;
		this.chunkSize = opt.chunkSize;
		this.byte = 0;
	}

	_read() {

		if (this.byte >= this.buffer.length - 1) {
			this.push(null)
		} else {
			let part = this.buffer.slice(this.byte, this.byte + this.chunkSize); 
			this.push(part);
			this.byte += this.chunkSize;
			console.log("pushed", part.length, "bytes");
		}
		
	}

}

module.exports = BufferToStream;
