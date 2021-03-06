const { emit } = require("../state");
const { persistConfig, persistUser, persistNodes } = require("../model")
const { store } = require("../store");

const createConfigTable = (defaults) => { 
	return persistConfig(defaults);
}

/**
 * 
 * @param {Object} store must contain master.hash, name, master.cert
 */
const createUsersTable = (store) => {
	const query = {
		hash: store.master.hash,
		name: store.name,
		cert: store.master.cert.toString("utf-8"),
		type: 0 
	}
	return persistUser(query);
}

/**
 * 
 * @param {Object} store must contain master.hash, nodeName, node.hash
 * @param {Object} defaults ip4, router, bootstrap, stun, turn
 */
const createNodesTable = (store, defaults) => {
	const query = {
		name: store.nodeName,
		hash: store.node.hash,
		user_hash: store.master.hash,
		ip4: defaults.ip4,
		router_port: defaults.router,
		bootstrap_port: defaults.bootstrap,
		stun_port: defaults.stun,
		turn_port: defaults.turn
	};
	return persistNodes([query]);
}

/**
 * 
 * @param {Object} defaults router, bootstrap, dhtLookup, dhtAnnounce, external, autoDefine, ip4, stun, turn
 * @param {Object} store FOR TESTS! master.hash, master.cert, name, nodeName, node.hash
 */
module.exports.createDataBase = (defaults, _store) => { 
	return new Promise(async (resolve, reject) => {
		try {
			_store = _store || store;
			await createConfigTable(defaults);
			await createUsersTable(_store);
			await createNodesTable(_store, defaults);
			resolve(1);
		} catch (err) {
			reject(err);
		}
	});
}

module.exports.cconfig = createConfigTable;
module.exports.cusers = createUsersTable;
module.exports.cnodes = createNodesTable;