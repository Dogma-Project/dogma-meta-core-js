const { Readable } =  require('stream');
const { fileTransfer } = require("../nedb");
const EventEmitter = require("../eventEmitter");
const fs = require('fs');

var files = {

	buffer: [],
	sizes: [],

	/**
	 * 
	 * @param {ArrayBuffer} data
	 * @returns 
	 */
	createFileBuffer(data) {
		const descriptor = data.readUInt16BE(0);
		const chunk = data.slice(2);
		console.log("GOT FILE DATA", descriptor);
		if (!files.buffer[descriptor]) files.buffer[descriptor] = Buffer.allocUnsafe(0);
		let buffer = files.buffer[descriptor];
		const size = files.sizes[descriptor];
		files.buffer[descriptor] = Buffer.concat([buffer, chunk], buffer.length + chunk.length);
		// console.log(">", descriptor, chunk.byteLength, buffer.length);
		// console.log(buffer.length, size);
		if (files.buffer[descriptor].length === size) {
			console.log("File", descriptor, "bufferization completed");
			EventEmitter.emit("file-buffer-complete", { descriptor, size });
		}
	},

	/**
	 * 
	 * @param {String} device_id node id
	 * @param {Object} file file description
	 */
	permitFileTransfer(device_id, file) {
		const { descriptor, size } = file;
		files.sizes[descriptor] = size;
		return new Promise((resolve, reject) => {
			fileTransfer.update({ device_id, descriptor, send: 1 }, { device_id, descriptor, size, send: 1 }, { upsert: true }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		});
	},

	/**
	 * 
	 * @param {Object} params device_id, descriptor, title, size
	 * @returns 
	 */
	permitFileDownload(params) { // wtf
		return new Promise((resolve, reject) => {
			const { device_id, descriptor, title, size } = params;
			fileTransfer.update({ device_id, descriptor, title, size, send: 0 }, { device_id, descriptor, title, size, send: 0 }, { upsert: true }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		});		
	},

	sendFile({ device_id, descriptor }) {
		if (files.buffer[descriptor]) {
			const readable = files.bufferToStream(files.buffer[descriptor], {
				chunkSize: 2048 // edit
			});
			EventEmitter.emit("send-file", {
				device_id,
				descriptor,
				stream: readable
			});
		} else {
			console.warn("file buffer didn't find", descriptor);
		}
	},

	bufferToStream(buffer) { // wtf
		let stream = new Readable({ highWaterMark: 200000 });
		stream.push(buffer);
		stream.push(null);
		return stream;
	},

	handleRequest({ device_id, request }) {
		const { data: { descriptor } } = request;
		if (!descriptor) return console.warn("unknown file descriptor");
		switch (request.action) {
			case "download":
				files.sendFile({ device_id, descriptor });
			break;
		}
	},

	/**
	 * 
	 * @param {Number} descriptor 
	 * @param {Buffer} data 
	 */
	handleFile(descriptor, data) {
		fileTransfer.findOne({ descriptor, send: 0 }, async (err, result) => { // get expected file size
			if (err) return console.error(err);
			if (!result) return console.warn("file descriptor not found", descriptor, result);
			console.log("downloaded file", result);

			fs.writeFile(global.datadir + "/download/" + result.title, data, function(err) {
				if (err) return console.error("saving file error", err);
				console.log(`The file ${result.title} was saved!`);
			}); 
			
		})
	}
}

module.exports = files;