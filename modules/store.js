'use strict';
const db = require("./db");
const homedir = require('os').homedir();
const fs = require("fs"); // edit
const crypt = require("./crypt");
const {emit, subscribe, services} = require("./state");

var store = { 
	name: "Dogma Username", // edit
	nodeName: "Dogma Nodename", // edit
	config: {},
	protocol: 4,
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

function errorHandler(error, code) {
	console.error("1", error, code);
}

function getKeys() { 
	if (!store.master.key) {
		try {
			store.master.key = fs.readFileSync(homedir + "/.dogma-node/key.pem");
			store.master.cert = fs.readFileSync(homedir + "/.dogma-node/cert.pem");
			store.master.hash = crypt.getPublicCertHash(store.master.cert);
			emit("master-key", store.master);
		} catch (e) {
			console.error("MASTER KEYS NOT FOUND");
			services.masterKey = 0;
		}
	}

	if (!store.node.key) {
		try {
			store.node.key = fs.readFileSync(homedir + "/.dogma-node/node-key.pem");
			store.node.cert = fs.readFileSync(homedir + "/.dogma-node/node-cert.pem");
			store.node.hash = crypt.getPublicCertHash(store.node.cert, true);
			emit("node-key", store.node);
		} catch (e) {
			console.error("NODE KEYS NOT FOUND");
			services.nodeKey = 0;
		}
		
	}
	
}

async function readConfigTable() {
	await db.all("SELECT * FROM config").then(result => { 
		result.forEach((element) => {
			store.config[element.param] = element.value;
			emit("config-" + element.param, element.value);
		});
	}).catch(errorHandler); 
}

async function readUsersTable() {
	await db.all("SELECT * FROM users").then(result => { 
		let caArray = [];
		result.forEach(user => caArray.push(Buffer.from(user.cert))); // check exceptions
		store.ca = caArray;
		store.users = result;
		emit("users", store.users);
	}).catch(errorHandler); 
}

async function readNodesTable() {
	await db.all("SELECT * FROM nodes").then(result => { 
		store.nodes = result;
		const currentNode = store.nodes.find(node => node.hash === store.node.hash); 
		if (currentNode) {
			store.node.ip4 = currentNode.ip4;
		} else {
			console.warn("OWN NODE NOT FOUND");
		}
		emit("nodes", store.nodes);
	}).catch(errorHandler); 
}

const checkHomeDir =() => {
	return new Promise((resolve, reject) => {
		try {
			const dir = homedir + "/.dogma-node/";
			if (!fs.existsSync(dir)) fs.mkdirSync(dir);
			resolve();
		} catch (error) {
			reject(error);
		}

	});
}

const getConfig = () => { 
	readConfigTable();
	readUsersTable();
	readNodesTable();
	services.database = 2;
}

const openDb = () => { // edit
	db.open().then(getConfig).catch((error) => { 
		console.log(error.code, "Node db is absent. Generation...");
		services.database = 0;
	});
}

subscribe(["master-key"], () => {
	services.masterKey = 2;
});
subscribe(["node-key"], () => {
	services.nodeKey = 2;
});

subscribe(["db-ready"], () => {
	services.database = 1;
	openDb();
});
subscribe(["master-key", "node-key"], openDb);
subscribe(["table-config"], readConfigTable);
subscribe(["table-nodes"], readNodesTable);
subscribe(["table-users"], readUsersTable);

// INIT POINT
checkHomeDir().then(getKeys).catch(error => {
	console.error("CRITICAL ERROR. CAN'T CREATE HOME DIR");
});

module.exports = store;