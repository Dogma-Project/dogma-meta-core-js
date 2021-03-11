const { fileTransfer } = require("./nedb");
var files = {

	buffer: [],

	/**
	 * 
	 * @param {ArrayBuffer} data
	 * @returns 
	 */
	createFileBuffer(data) {
		const context = data.readUInt16BE(0);
		console.log("GOT FILE DATA", context);
		// const chunk = data.slice(15, 100015);
		if (!files.buffer[context]) files.buffer[context] = [];
		files.buffer[context].push(data);
		console.log(">", context, data.byteLength, files.buffer[context].length);
	},

	/**
	 * 
	 * @param {String} deviceId node id
	 * @param {Number} descriptor transfer id
	 */
	permitFileTransfer(deviceId, descriptor) {
		return new Promise((resolve, reject) => {
			fileTransfer.update({ deviceId, descriptor }, { deviceId, descriptor }, { upsert: true }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		});
	}
}

module.exports = files;