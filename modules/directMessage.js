const EventEmitter = require("./eventEmitter");
const { directMessages } = require("./nedb");
module.exports = {
	/**
	 * 
	 * @param {String} hash
	 * @param {String} message 
	 * @param {Number} type 0 - outcoming, 1 - incoming
	 */
	commit: (hash, message, type) => { // edit
		const time = new Date().getTime();
		const params = {
			hash,
			message,
			type: Number(type),
			time
		};
		directMessages.insert(params, (err, result) => {
			if (err) return console.error(err);
			EventEmitter.emit("direct-messages", {
				code: 1,
				data: {
					device_id: hash, // change property to hash
					message,
					type,
					time
				}
			});
		});
	}, 

	/**
	 * 
	 * @param {Object} params hash, since
	 */
	getDirectMessages: (params) => { // add test
		return new Promise((resolve, reject) => {
			directMessages.find({ device_id: params.hash }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
	}
}