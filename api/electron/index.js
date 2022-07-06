const { ipcMain } = require("electron");

const Server = require("../main/index");
const filesHandler = require("./files");

class ElectronServer extends Server {

	constructor() {
		super();
		this.bridge = ipcMain;
	}

	/**
	 * 
	 * @param {String} type 
	 * @param {String} responseType 
	 * @param {Functio} getter async
	 */
	_on(type, responseType, getter) {
		this.bridge.on(type, async (event, data) => {
			const result = await getter(data);
			event.reply(responseType, result);
		});
	}

	/**
	 * 
	 * @param {String} type 
	 * @param {Function} getter async
	 */
	_handle(type, getter) {
		this.bridge.handle(type, async (_event, data) => {
			const result = await getter(data);
			return result;
		});
	}

	/**
	 * 
	 * @param {String} type 
	 * @param {*} data 
	 */
	_broadcast(type, data) {
		global.win && global.win.webContents.send(type, data);
	}

	_filesHandler() {
		super._filesHandler();
		filesHandler.call(this);
	}

}

module.exports = ElectronServer;