const certHandler = require("./handlers/cert-handler");
const servicesHandler = require("./handlers/services-handler");
const configHandler = require("./handlers/config-handler");
const friendsHandler = require("./handlers/friends-handler");
const messagesHandler = require("./handlers/messages-handler");
const keysGeneratorHandler = require("./handlers/keys-generator-handler");
const configGeneratorHandler = require("./handlers/config-generator-handler");
const filesHandler = require("./handlers/files-handler");
const connectionsHandler = require("./handlers/connections-handler");

class Server {

	constructor() {
		this.handlers = {};
		this.bridge = null;
	}

	/**
	 * 
	 * @param {Object} ee EventEmitter 
	 * @param {Object} api 
	 * @returns 
	 */
	subscribe(ee, api) {
		if (!ee || !api) return console.error("unknown event emitter or api!", typeof ee, typeof api);
		this.ee = ee;
		this.api = api;
	}

	_certHandler() {
		certHandler.call(this);
	}

	_servicesHandler() {
		servicesHandler.call(this);
	}

	_configHandler() {
		configHandler.call(this);
	}

	_friendsHandler() {
		friendsHandler.call(this);
	}

	_messagesHandler() {
		messagesHandler.call(this);
	}

	_keysGeneratorHandler() {
		keysGeneratorHandler.call(this);
	}

	_configGeneratorHandler() {
		configGeneratorHandler.call(this);
	}

	_filesHandler() {
		filesHandler.call(this);
	}

	_connectionsHandler() {
		connectionsHandler.call(this);
	}

	/**
	 * 
	 * @param {Object} bridge [optional]
	 */
	init(bridge) {
		try {
			if (bridge) this.bridge = bridge;
			this._servicesHandler();
			this._friendsHandler();
			this._messagesHandler();
			this._certHandler();
			this._configHandler();
			this._keysGeneratorHandler();
			this._configGeneratorHandler();
			this._filesHandler();
			this._connectionsHandler();
		} catch (err) {
			console.error("api server", "main", "socket server error 2", err);
		}
	}

}

module.exports = Server;