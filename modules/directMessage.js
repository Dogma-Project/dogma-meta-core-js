const EventEmitter = require("./eventEmitter");
const { directMessages } = require("./nedb");
module.exports = {
	/**
	 * 
	 * @param {String} hash
	 * @param {String} message 
	 * @param {Number} type 0 - outcoming, 1 - incoming
	 * @param {Number} format 0 - message, 1 - files
	 */
	commit: (hash, message, type, format) => { // edit
		format = Number(format) || 0;
		type = Number(type);
		console.log("COMMIT FORMAT", format);
		const time = new Date().getTime();
		const data = {
			device_id: hash,
			message,
			type,
			time,
			format
		};
		directMessages.insert(data, (err, result) => {
			if (err) return console.error(err);
			EventEmitter.emit("direct-messages", {  // return to own node
				code: 1, // check
				data
			});
		});
	}, 

	/**
	 * 
	 * @param {Object} params hash, since
	 */
	getDirectMessages: (params) => { // add test
		return new Promise((resolve, reject) => {
			directMessages.find({ device_id: params.hash }).sort({ time: 1 }).exec((err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
	}
}