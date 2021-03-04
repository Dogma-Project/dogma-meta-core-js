'use strict';

const { config, users, nodes } = require("./nedb");
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
		config.find({}, (err, data) => {
			if (err) return reject(err);
			data.forEach((element) => {
				store.config[element.param] = element.value;
				emit("config-" + element.param, element.value);
			});
			resolve(data);
		})
	});
}

const readUsersTable = () => {
	return new Promise((resolve, reject) => {
		users.find({}, (err, data) => {
			if (err) return reject(err);
			let caArray = [];
			data.forEach(user => caArray.push(Buffer.from(user.cert))); // check exception
			store.ca = caArray;
			store.users = data;
			emit("users", data);
			resolve(data);
		});
	});
}

const readNodesTable = () => {
	return new Promise((resolve, reject) => {
		nodes.find({}, (err, data) => {
			if (err) return reject(err);
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
	});
}

const checkHomeDir = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!fs.existsSync(global.datadir)) fs.mkdirSync(global.datadir, {
				recursive: true
			});
			resolve();
		} catch (err) {
			reject(err);
		}

	});
}

const getConfigs = () => { 
	readConfigTable();
	readUsersTable();
	readNodesTable();
	services.database = 2;
}

subscribe(["master-key"], () => {
	services.masterKey = 2;
});
subscribe(["node-key"], () => {
	services.nodeKey = 2;
});

subscribe(["db-ready"], () => {
	services.database = 1;
	getConfigs();
});
subscribe(["master-key", "node-key"], getConfigs);
subscribe(["config-db"], readConfigTable);
subscribe(["users-db"], readNodesTable);
subscribe(["nodes-db"], readUsersTable);

subscribe(["config-db", "users-db", "nodes-db"], () => {
	console.log("STATE", state);
	if (state["config-db"] == 2 && state["users-db"] == 2 && state["nodes-db"] == 2) {
		emit("db-ready", 1);
	}
})

// INIT POINT
checkHomeDir().then(getKeys).catch(error => {
	console.error("CRITICAL ERROR. CAN'T CREATE HOME DIR");
});

module.exports.store = store;
module.exports.rconfig = readConfigTable;
module.exports.rusers = readUsersTable;
module.exports.rnodes = readNodesTable;