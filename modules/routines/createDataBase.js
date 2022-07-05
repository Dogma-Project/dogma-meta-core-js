const { Config, User, Node, Protocol } = require("../model")
const { PROTOCOL } = require("../constants");

/**
 * 
 * @param {Object} defaults 
 * @returns {Promise} 
 */
const createConfigTable = (defaults) => {
	return Protocol.persistProtocol(PROTOCOL).then(Config.persistConfig(defaults)); // check
}

/** @module CreateDataBase */

/**
 * 
 * @param {Object} store main app's store
 * @param {Object} store.user
 * @param {String} store.user.name
 * @param {String} store.user.id user hash
 * @param {Buffer} store.user.cert master certificate // check
 */
const createUsersTable = (store) => {
	const { id: user_id, name, cert } = store.user;
	const query = {
		user_id,
		name,
		cert: cert.toString("utf-8"),
		type: 0
	}
	return User.persistUser(query);
}

/**
 * 
 * @param {Object} store 
 * @param {String} store.user.id
 * @param {String} store.node.name
 * @param {String} store.node.id
 * @param {Object} defaults 
 * @param {String} defaults.public_ipv4
 * @param {Number} defaults.router
 */
const createNodesTable = (store, defaults) => {
	const query = {
		name: store.node.name,
		node_id: store.node.id,
		user_id: store.user.id,
		public_ipv4: defaults.public_ipv4,
		router_port: defaults.router
	};
	return Node.persistNodes([query]);
}

/**
  * 
* @param {Object} store 
* @param {Object} store.user.name
* @param {Object} store.user.id
* @param {Object} store.user.cert
* @param {Object} store.node.name
* @param {Object} store.node.id
* @param {Object} defaults 
* @param {*} defaults.router
* @param {*} defaults.bootstrap
* @param {*} defaults.dhtLookup
* @param {*} defaults.dhtAnnounce
* @param {*} defaults.external
* @param {*} defaults.autoDefine
* @param {*} defaults.public_ipv4
* @param {*} defaults.stun
* @param {*} defaults.turn
*/
module.exports.createDataBase = (store, defaults) => {
	return new Promise(async (resolve, reject) => {
		try {
			await createConfigTable(defaults);
			await createUsersTable(store);
			await createNodesTable(store, defaults);
			resolve(1);
		} catch (err) {
			reject(err);
		}
	});
}

module.exports.cconfig = createConfigTable;
module.exports.cusers = createUsersTable;
module.exports.cnodes = createNodesTable;