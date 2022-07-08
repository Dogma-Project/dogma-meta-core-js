const Server = require("../socket.io/index");
const filesHandler = require("./files");

class ElectronServer extends Server {

	// constructor() {
	// 	super();
	// }

	_filesHandler() {
		super._filesHandler();
		filesHandler.call(this);
	}

}

module.exports = ElectronServer;