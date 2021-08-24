const fs = require('fs');

const { BufferToStream } = require("../streams");
const { fileTransfer } = require("../nedb");
const EventEmitter = require("../eventEmitter");

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
			fileTransfer.update({ device_id, descriptor, send: 1 }, { $set: { device_id, descriptor, size, send: 1 } }, { upsert: true }, (err, result) => {
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
			fileTransfer.update({ device_id, descriptor, title, size, send: 0 }, { $set: { device_id, descriptor, title, size, send: 0 } }, { upsert: true }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		});		
	},

	sendFile({ device_id, descriptor }) {
		if (files.buffer[descriptor]) {
			const buffer = files.buffer[descriptor];
			const stream = new BufferToStream({ buffer, chunkSize: 100000 }); // edit
			EventEmitter.emit("send-file", { device_id, descriptor, stream });
		} else {
			console.warn("file buffer didn't find", descriptor);
		}
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
			console.log("result", result);
			const size = result.downloaded || 0;
			if (size >= result.size) return console.log("file", result.title, "already downloaded");
			const destination = global.datadir + "/download/" + result.title;
			fs.appendFile(destination, data, (err) => {
				if (err) return console.error("saving file error", err);
				console.log(`The file ${result.title} was updated!`);
				const downloaded = size + data.length;
				fileTransfer.update({ descriptor, send: 0}, { $set: { downloaded }}, (err) => {
					if (err) console.error("can't update downloaded file size in db", err);
				});
			}); 
			
		})
	}
}

module.exports = files;