
const Server = require("../main/index");

class SocketServer extends Server {

	constructor() {
		super();
	}

	/**
	 * 
	 * @param {String} type 
	 * @param {String} responseType 
	 * @param {Function} getter async
	 */
	_on(type, responseType, getter) {
		this.bridge.on(type, async (data) => {
			const result = await getter(data);
			this.bridge.emit(responseType, result);
		});
	}

	/**
	 * 
	 * @param {String} type 
	 * @param {Function} getter async
	 */
	_handle(type, getter) {
		this.bridge.on(type, async (data, cb) => {
			const result = await getter(data);
			cb && cb(result);
		});
	}

	/**
	 * 
	 * @param {String} type 
	 * @param {*} data 
	 */
	_broadcast(type, data) {
		this.bridge.emit(type, data);
	}

}

module.exports = SocketServer;