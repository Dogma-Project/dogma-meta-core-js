

const crypt = require("./crypt");
const { createDataBase } = require("./routines/createDataBase");
const { store } = require("./store");
const generateMasterKeys = require("./routines/generateMasterKeys");
const generateNodeKeys = require("./routines/generateNodeKeys");
const { services } = require("./state");
const { API: c, MESSAGES } = require("./constants"); // edit
const FilesController = require("./controllers/files");
const logger = require("../logger");
const connection = require("./connection");
const { Connection, Config, User, Message } = require("./model");

/** @module GeneralApi */

/**
 * 
 * @param {Number} code 
 * @param {*} data 
 */
const response = (code, data) => {
	code = Number(code) || 0;
	data = data || null;
	return {
		code,
		data
	}
}

/**
 * 
 * @param {Object} _store main store
 * @returns {Object}
 */
const getFriends = async (_store) => { // edit
	if (!_store || !_store.users || !_store.nodes) logger.warn("api", "empty store");
	let object = [];
	let usersKeys = {};
	object = store.users.map((user, i) => {
		delete user.cert;
		user.nodes = [];
		usersKeys[user.user_id] = i;
		return user;
	});
	_store.nodes.forEach((node) => {
		const uh = node.user_id;
		if (usersKeys[uh] !== undefined) {
			const i = usersKeys[uh];
			const online = connection.online.indexOf(node.node_id) > -1;
			object[i].nodes.push({
				name: node.name,
				node_id: node.node_id, // edit // check on client
				online
			});
		}
	});

	object = object.map(item => {
		const online = item.nodes.filter(x => !!x.online);
		item.onlineCount = online.length;
		return item;
	});

	for (let friend of object) {
		const { user_id } = friend;
		friend.messages = await Message.getStatus({ id: user_id, type: MESSAGES.USER });
	}
	return object;
}

module.exports.certificate = {
	/**
	 * @returns {Object} result
	 */
	get: async () => {
		try {
			const result = await crypt.getDogmaCertificate(store);
			return response(c.OK, result);
		} catch (err) {
			logger.error("api certificate", "get 2", err);
			return response(c.CANNOTGETCERT, err);
		}
	},
	set: () => {
		logger.log("api certificate", "set", "nothing to do");
	},
	/**
	 * 
	 * @param {String} cert b64
	 * @returns {Object} result
	 */
	push: async (cert) => {
		const parsed = crypt.validateDogmaCertificate(cert, store.user.id);
		if (parsed.result) {
			const result = await crypt.addDogmaCertificate(parsed);
			if (result) {
				return response(c.OK, result)
			} else {
				return response(c.ADDCERTERROR); // add message
			}
		} else {
			return response(c.INVALIDCERT, parsed.error);
		}
	}
}


module.exports.database = {
	get: () => {

	},

	/**
	 * 
	 * @param {Object} store
	 * @param {Object} defaults 
	 * @param {Number} defaults.router main node's port
	 * @param {Number} defaults.bootstrap DHT server permission level
	 * @param {Number} defaults.dhtLookup DHT lookup permission level
	 * @param {Number} defaults.dhtAnnounce DHT announce permission level
	 * @param {String} defaults.external
	 * @param {Number} defaults.autoDefine
	 * @param {String} defaults.public_ipv4
	 * @param {Number} defaults.stun
	 * @param {Number} defaults.turn
	 * @returns {Object} result
	 */
	set: async (defaults) => {
		try {
			const result = await createDataBase(store, defaults);
			return response(c.OK, result);
		} catch (err) {
			logger.error("API database", "set", err);
			return response(c.CREATEDBERROR, err); // edit
		}
	}
}


module.exports.config = {
	get: () => {
		try {
			const result = store.config;
			return response(c.OK, result);
		} catch (err) {
			logger.error("API config", "get", err);
			return response(c.GETCONFIGERROR, err);
		}
	},
	/**
	 * 
	 * @param {Object} data 
	 * @returns {Object} result
	 */
	set: async (data) => {
		try {
			const result = await Config.persistConfig(data);
			return response(c.OK, result);
		} catch (err) {
			logger.error("API config", "set", err);
			return response(c.CONFIGSAVEERROR, err);
		}
	}
}

module.exports.messages = {
	/**
	 * 
	 * @param {Object} params 
	 * @param {String} params.id
	 * @param {Number} params.since 
	 * @param {Number} params.type
	 * @returns {Array}
	 */
	get: async (params) => {
		try {
			const result = await Message.get(params);
			return response(c.OK, result);
		} catch (err) {
			return response(c.CANNOTGETDM, err); // edit
		}
	},
	/**
	 * 
	 * @param {Object} data
	 * @param {String} data.to
	 * @param {Object} data.message id,text,files
	 * @param {Number} data.type 
	 */
	push: async (data) => {
		try {
			const { to, message, type } = data;
			const result = await connection.sendMessage(to, message, type);
			return response(c.OK, result);
		} catch (err) {
			return response(c.CANNOTPUSHMSG, err);
		}
	}
}

module.exports.friends = {
	get: async () => {
		try {
			const result = await getFriends(store);
			return response(c.OK, result);
		} catch (err) {
			return response(c.CANNOTGETFRIENDS, err);
		}
	},
	set: () => {
		logger.warn("api friends", "set", "do nothing");
	},
	/**
	 * 
	 * @param {String} user_id 
	 */
	delete: async (user_id) => {
		try {
			if (store.user.id === user_id) return response(c.CANNOTDELETEITSELF, user_id);
			const result = await User.removeUser(user_id);
			return response(c.OK, result);
		} catch (err) {
			return response(c.CANNOTDELETEFRIEND, err);
		}
	}
}

module.exports.masterKey = {
	get: () => {

	},
	/**
	 * 
	 * @param {Object} params 
	 */
	set: (params) => {
		const result = generateMasterKeys(store, params);
		if (result.result) {
			return response(c.OK);
		} else {
			return response(c.CANNOTCREATEMK, result.error);
		}
	}
}

module.exports.nodeKey = {
	get: () => {

	},
	/**
	 * 
	 * @param {Object} params 
	 */
	set: (params) => {
		const result = generateNodeKeys(store, params);
		if (result.result) {
			return response(c.OK);
		} else {
			return response(c.CANNOTCREATENK, result.error);
		}
	}
}

module.exports.services = {
	/**
	 * @returns {Object}
	 */
	get: () => {
		try {
			const result = JSON.parse(JSON.stringify(services));
			return response(c.OK, result);
		} catch (err) {
			logger.error("API services", "get", err);
			return response(c.CANNOTGETSERVICES, err);
		}
	},
	set: () => {

	}
}

module.exports.files = {
	/**
	 * 
	 * @param {Object} params to, type, request{type, action, [data]}
	 */
	get: async (params) => {
		const {
			to,
			request,
			type,
			request: {
				data: {
					descriptor,
					title,
					size
				}
			}
		} = params;

		try {
			await FilesController.permitFileDownload({ to, type, descriptor, title, size });
			const result = await connection.sendRequest(to, request, type);
			return response(c.OK, result);
		} catch (err) {
			return response(c.OK, err); // edit
		}
	},
	/**
	 * 
	 * @param {Object} data ArrayBuffer
	 * @returns {Object} response
	 */
	push: (data) => {
		// deprecated
	},

	/**
	 * 
	 * @param {Object} params
	 */
	delete: (params) => {
		logger.debug("api files", "delete", params);
	}

}

module.exports.connections = {

	get: async () => {
		try {
			const result = await Connection.getConnections();
			return response(c.OK, result);
		} catch (err) {
			logger.error("API connections", "get", err);
			return response(c.CANNOTGETCONNECTIONS, err);
		}
	},

	/**
	 * 
	 * @param {String} id connection id
	 */
	delete: (id) => {

	}
}