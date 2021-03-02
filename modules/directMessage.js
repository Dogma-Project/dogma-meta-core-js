const EventEmitter = require("./eventEmitter");

module.exports = {
	/**
	 * 
	 * @param {String} hash
	 * @param {String} message 
	 * @param {Number} type 0 - outcoming, 1 - incoming
	 */
	commit: (hash, message, type) => {
		const time = new Date().getTime();
		const params = [
			hash,
			message,
			Number(type),
			time
		];
        global.temp.query("INSERT INTO dm(device_id,message,type,time) VALUES(?,?,?,?)", params).then(() => { 
			EventEmitter.emit("direct-messages", {
				code: 1,
				data: {
					device_id: hash,
					message,
					type,
					time
				}
			});
        }).catch(async (err) => { 
            console.error(err);
		});
	}
}