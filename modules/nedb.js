const Datastore = require('nedb');
const {emit, services} = require("./state");

const dbDir = global.datadir + "/db";
console.log("HOMEDIR", dbDir);

var stores = {};

const indexHandler = (err) => {
	console.error(err);
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



stores.config = new Datastore({ 
	filename: dbDir + "/config.db",
	autoload: true,
	onload: (err) => {
		if (err) {
			console.error("Couldn't create main database", err);
		} else {
			emit("config-db", 1);
		}
	}
});
stores.config.ensureIndex({
	fieldName: "param",
	unique: true
}, indexHandler);



stores.nodes = new Datastore({ 
	filename: dbDir + "/nodes.db",
	autoload: true,
	onload: (err) => {
		if (err) {
			console.error("Couldn't create main database", err);
		} else {
			emit("nodes-db", 1);
		}
	}
});
stores.nodes.ensureIndex({
	fieldName: "hash", // edit // add composite key
	unique: true
}, indexHandler);


stores.users = new Datastore({ 
	filename: dbDir + "/users.db",
	autoload: true,
	onload: (err) => {
		if (err) {
			console.error("Couldn't create main database", err);
		} else {
			emit("users-db", 1);
		}
	}
});
stores.users.ensureIndex({
	fieldName: "hash",
	unique: true
}, indexHandler);


module.exports = stores;