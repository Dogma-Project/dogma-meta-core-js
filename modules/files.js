const { fileTransfer } = require("./nedb");
const { Readable } =  require('stream');
const EventEmitter = require("./eventEmitter");

var files = {

	buffer: [],

	/**
	 * 
	 * @param {ArrayBuffer} data
	 * @returns 
	 */
	createFileBuffer(data) {
		const context = data.readUInt16BE(0);
		const chunk = data.slice(2);
		// check length
		console.log("GOT FILE DATA", context);
		if (!files.buffer[context]) files.buffer[context] = Buffer.allocUnsafe(0);
		files.buffer[context] = Buffer.concat([files.buffer[context], chunk], files.buffer[context].length + chunk.length);
		console.log(">", context, chunk.byteLength, files.buffer[context].length);
		try {
			fileTransfer.findOne({ descriptor: context }, async (err, result) => { // get expected file size
				if (err) return console.error(err);
				if (!result) return console.warn("file descriptor not found", context, result);
				if (files.buffer[context].length === result.size) {
					console.log("File", context, "bufferization completed");
					EventEmitter.emit("file-buffer-complete", {
						descriptor: context,
						size: result.size
					});
				}
				// console.log("file size:", result.size);
			})
		} catch (err) {
			console.error(err);
		}
	},

	/**
	 * 
	 * @param {String} deviceId node id
	 * @param {Object} file file description
	 */
	permitFileTransfer(deviceId, file) {
		return new Promise((resolve, reject) => {
			const { descriptor, size } = file;
			fileTransfer.update({ deviceId, descriptor }, { deviceId, descriptor, size }, { upsert: true }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		});
	},

	bufferToStream(buffer) {
		let stream = new Readable({ highWaterMark: 200000 });
		stream.push(buffer);
		stream.push(null);
		return stream;
	}
}

module.exports = files;