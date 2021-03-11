const Datastore = require('nedb');
const { emit } = require("./state");

const dbDir = global.datadir + "/db";
console.log("HOMEDIR", dbDir);

var stores = {};

const indexHandler = (err) => { // edit
	// if (err) console.error("nedb indexHandler error::", err);
}

//del
stores.temp = new Datastore({
	autoload: true
});

stores.connections = new Datastore({
	autoload: true
});
stores.connections.ensureIndex({
	fieldName: "device_id",
	unique: true
}, indexHandler);
stores.connections.ensureIndex({
	fieldName: "address",
	unique: true
}, indexHandler);

stores.directMessages = new Datastore({
	autoload: true
});

stores.fileTransfer = new Datastore({
	autoload: true
});

// ------------------------ PERSIST -------------------------

stores.config = new Datastore({ 
	filename: dbDir + "/config.db"
});
stores.config.ensureIndex({
	fieldName: "param",
	unique: true
}, indexHandler);


stores.nodes = new Datastore({ 
	filename: dbDir + "/nodes.db"
});
// stores.nodes.ensureIndex({
// 	fieldName: "hash", // edit // add composite key
// 	unique: true
// }, indexHandler);


stores.users = new Datastore({ 
	filename: dbDir + "/users.db"
});
stores.users.ensureIndex({
	fieldName: "hash",
	unique: true
}, indexHandler);


stores.initPersistDbs = () => {
	console.log("load databases...");
	stores.config.loadDatabase((err) => {
		if (err) {
			console.error("Couldn't load config database", err);
		} else {
			emit("config-db", 1);
		}
	});
	stores.users.loadDatabase((err) => {
		if (err) {
			console.error("Couldn't load users database", err);
		} else {
			emit("users-db", 1);
		}
	});
	stores.nodes.loadDatabase((err) => {
		if (err) {
			console.error("Couldn't load nodes database", err);
		} else {
			emit("nodes-db", 1);
		}
	});
}

module.exports = stores;