const { emit } = require("../state");
const { config, users, nodes } = require("../nedb");

const createConfigTable = (defaults) => {
	return new Promise((resolve, reject) => { 
		const newArr = Object.keys(defaults).map((key) => {
			return {
				param: key,
				value: defaults[key]
			};
		});
		config.insert(newArr, (err, result) => {
			if (err) return reject(err);
			emit("config-db", 2);
			resolve(result);
		});
	});
}

/**
 * 
 * @param {Object} store must contain master.hash, name, master.cert
 */
const createUsersTable = (store) => {
	return new Promise((resolve, reject) => { 
		const doc = {
			hash: store.master.hash,
			name: store.name,
			cert: store.master.cert.toString("utf-8"),
			type: 0 
		}
		users.insert(doc, (err, result) => {
			if (err) return reject(err);
			emit("users-db", 2);
			resolve(result);
		});
	});
}

/**
 * 
 * @param {Object} store must contain master.hash, nodeName, node.hash
 * @param {Object} defaults ip4, router, bootstrap, stun, turn
 */
const createNodesTable = (store, defaults) => {
	return new Promise((resolve, reject) => { 
		const doc = {
			name: store.nodeName,
			hash: store.node.hash,
			user_hash: store.master.hash,
			ip4: defaults.ip4,
			router_port: defaults.router,
			bootstrap_port: defaults.bootstrap,
			stun_port: defaults.stun,
			turn_port: defaults.turn
		};
		nodes.insert(doc, (err, result) => {
			if (err) return reject(err);
			emit("nodes-db", 2);
			resolve(result);
		});
	});
}

/**
 * 
 * @param {Object} defaults router, bootstrap, dhtLookup, dhtAnnounce, external, autoDefine, ip4, stun, turn
 * @param {Object} store FOR TESTS! master.hash, master.cert, name, nodeName, node.hash
 */
module.exports.createDataBase = (defaults, store) => { 
	return new Promise(async (resolve, reject) => {
		try {
			if (!store) {
				const { store } = require("../store");
			}
			await createUsersTable(store);
			await createNodesTable(store, defaults);
			await createConfigTable(defaults);
			resolve(1)
		} catch (err) {
			reject(err);
		}
	});
}

module.exports.cconfig = createConfigTable;
module.exports.cusers = createUsersTable;
module.exports.cnodes = createNodesTable;