const EventEmitter = require("./eventEmitter");
const { Message } = require("./model");
const generateSyncId = require("./generateSyncId");
const { emit } = require("./state");

/** @module Messages */

module.exports = {

	/**
	 * 
	 * @param {Object} params
	 * @param {String} params.id
	 * @param {String} params.text
	 * @param {Array} params.files
	 * @param {Number} params.direction 
	 * @param {Number} params.format 
	 * @param {Number} params.type 
	 */
	commit: async ({ id, text, files, direction, format, type }) => {
		try {
			const sync_id = generateSyncId(6);
			const data = { id, sync_id, text, files, direction, format, type };
			await Message.push(data);
			if (data.type) emit("new-message", data); // check
			const time = new Date().getTime();
			EventEmitter.emit("messages", {  // return to own node
				code: 1, // edit
				data: {
					createdAt: time,
					...data
				},
			});
			return sync_id;
		} catch (err) {
			return Promise.reject(err);
		}
	},

}