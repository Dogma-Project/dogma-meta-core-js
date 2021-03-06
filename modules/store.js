'use strict';

const { initPersistDbs, config, users, nodes } = require("./nedb");
const fs = require("fs"); // edit
const crypt = require("./crypt");
const {emit, subscribe, services, state} = require("./state");

const keysDir = global.datadir + "/keys";

var store = { 
	name: "Dogma Username", // edit
	nodeName: "Dogma Nodename", // edit
	config: {},
	protocol: 5,
	ca: [],
	users: [],
	node: {
		key: null,
		cert: null,
		hash: null,
		ip4: null
	},
	master: {
		key: null,
		cert: null,
		hash:  null
	}
};

const getKeys = () => { 
	
	if (!store.master.key) {
		try {
			store.master.key = fs.readFileSync(keysDir + "/key.pem");
			store.master.cert = fs.readFileSync(keysDir + "/cert.pem");
			store.master.hash = crypt.getPublicCertHash(store.master.cert);
			emit("master-key", store.master);
		} catch (e) {
			console.error("MASTER KEYS NOT FOUND");
			services.masterKey = 0;
		}
	}

	if (!store.node.key) {
		try {
			store.node.key = fs.readFileSync(keysDir + "/node-key.pem");
			store.node.cert = fs.readFileSync(keysDir + "/node-cert.pem");
			store.node.hash = crypt.getPublicCertHash(store.node.cert, true);
			emit("node-key", store.node);
		} catch (e) {
			console.error("NODE KEYS NOT FOUND");
			services.nodeKey = 0;
		}
	}
	
}

const readConfigTable = () => {
	return new Promise((resolve, reject) => {
		try {
			config.find({}, (err, data) => {
				if (err) return reject(err);
				if (!data.length) return reject(0);
				data.forEach((element) => {
					store.config[element.param] = element.value;
					emit("config-" + element.param, element.value);
				});
				resolve(data);
			})
		} catch(err) {
			reject(err);
		}
	});
}

const readUsersTable = () => {
	return new Promise((resolve, reject) => {
		try {
			users.find({}, (err, data) => {
				if (err) return reject(err);
				if (!data.length) return reject(0);
				let caArray = [];
				data.forEach(user => caArray.push(Buffer.from(user.cert))); // check exception
				store.ca = caArray;
				store.users = data;
				emit("users", data);
				resolve(data);
			});
		} catch (err) {
			reject(err);
		}
	});
}

const readNodesTable = () => {
	return new Promise((resolve, reject) => {
		try {
			nodes.find({}, (err, data) => {
				if (err) return reject(err);
				if (!data.length) return reject(0);
				store.nodes = data;
				const currentNode = store.nodes.find(node => node.hash === store.node.hash); 
				if (currentNode) {
					store.node.ip4 = currentNode.ip4;
				} else {
					console.warn("OWN NODE NOT FOUND");
				}
				emit("nodes", store.nodes);
				resolve(data);
			})
		} catch (err) {
			reject(err);
		}
	});
}

const checkHomeDir = () => {
	return new Promise((resolve, reject) => {
		try {
			const dirs = [
				"keys",
				"db"
			];
			dirs.forEach((dir) => {
				dir = global.datadir + "/" + dir;
				if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
					recursive: true
				});
			});
			resolve();
		} catch (err) {
			reject(err);
		}

	});
}

subscribe(["master-key"], () => {
	services.masterKey = 2;
});
subscribe(["node-key"], () => {
	services.nodeKey = 2;
});

// subscribe(["master-key", "node-key"], getConfigs); // edit

subscribe(["config-db"], (_action, _status) => {
	readConfigTable().then((_result) => {
		emit("config-db", 2);
	}).catch((err) => {
		emit("config-db", 0);
		console.error("read config db error::", err);
	});
});
subscribe(["users-db"], (_action, status) => {
	readUsersTable().then((result) => {
		emit("users-db", 2);
	}).catch((err) => {
		emit("users-db", 0);
		console.error("read users db error::", err);
	});
});
subscribe(["nodes-db"], (_action, status) => {
	readNodesTable().then((result) => {
		emit("nodes-db", 2);
	}).catch((err) => { 
		emit("nodes-db", 0);
		console.error("read nodes db error::", err);
	});
});

subscribe(["config-db", "users-db", "nodes-db"], () => {
	if (state["config-db"] === 2 && state["users-db"] === 2 && state["nodes-db"] === 2) services.database = 2;
})

// INIT POINT
checkHomeDir().then(() => {
	initPersistDbs();
	getKeys();
}).catch((err) => {
	console.error("CRITICAL ERROR. CAN'T CREATE HOME DIR", err);
});

module.exports.store = store;
module.exports.rconfig = readConfigTable;
module.exports.rusers = readUsersTable;
module.exports.rnodes = readNodesTable;