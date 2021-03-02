const homedir = require('os').homedir();
const sqlite3 = require('sqlite3').verbose();
const store = require("../store");
const {emit} = require("../state");
const model = require("../model");

var database;

/**
 * 
 * @param {Object} defaults router, bootstrap, dhtLookup, dhtAnnounce, external, autoDefine, ip4
 */
function createConfigTable(defaults) { // edit ????? !!!!
	console.log("creating config table");
	return new Promise((resolve, reject) => {
		database.run(`CREATE TABLE "config" (
			param TEXT UNIQUE,
			value BLOB,
			CONSTRAINT config_PK PRIMARY KEY (param)
		)`, async (err) => { 
			if (err) {
				return reject("CRITICAL:: failed to create config table: " + err.message);
			} 
			try {
				const newObject = Object.keys(defaults).map((key) => {
					return [key, defaults[key]];
				});
				var stmt = database.prepare("INSERT INTO config(param,value) VALUES (?,?)");
				for (var i = 0; i < newObject.length; i++) {
					stmt.run(newObject[i]);
				}
				stmt.finalize();
				resolve(true);
			} catch (err2) {
				reject(err2);
			}
		});
	});
}

function createParamsTable() { 
	console.log("creating params table");
	return new Promise((resolve, reject) => {
		database.run(`CREATE TABLE "params" (
			param TEXT UNIQUE,
			value TEXT,
			CONSTRAINT params_PK PRIMARY KEY (param)
		)`, (err) => { 
			if (err) {
				return reject("CRITICAL:: failed to create params table: " + err.message);
			} 
			database.run(`INSERT INTO params(param,value) VALUES ('router', ${store.protocol})`, (err) => {
				if (err) {
					return reject("CRITICAL:: failed to insert defaults into a params table: " + err.message);
				} 
				resolve(true);
			});
		});
	});
}

function createUsersTable() { 
	return new Promise((resolve, reject) => {
		database.run(`CREATE TABLE users (
			hash TEXT NOT NULL UNIQUE,
			name TEXT DEFAULT 'Dogma User',
			cert TEXT NOT NULL,
			"type" INTEGER DEFAULT -1 NOT NULL,
			CONSTRAINT users_PK PRIMARY KEY (hash)
		)`, (err) => { 
			if (err) {
				return reject("CRITICAL:: failed to create users table: " + err.message);
			} 
			const params = [
				store.master.hash,
				store.name,
				store.master.cert.toString("utf-8"),
				"0" // own cert
			];
			database.run(`INSERT INTO users(hash,name,cert,"type") VALUES (?,?,?,?)`, params, (err) => {
				if (err) {
					return reject("CRITICAL:: failed to insert defaults into a users table: " + err.message);
				} 
				resolve(true);
			});
		});
	});
}

/**
 * 
 * @param {Object} defaults ip4, router, bootstrap, stun, turn
 */
function createNodesTable(defaults) { 
	return new Promise((resolve, reject) => {
		database.run(`CREATE TABLE nodes (
			name TEXT DEFAULT 'Dogma Node',
			hash TEXT NOT NULL,
			user_hash TEXT NOT NULL,
			ip4 TEXT DEFAULT '',
			router_port INTEGER DEFAULT '0',
			bootstrap_port INTEGER DEFAULT '0',
			stun_port INTEGER DEFAULT '0',
			turn_port INTEGER DEFAULT '0',
			CONSTRAINT nodes_PK PRIMARY KEY (hash,user_hash),
			CONSTRAINT nodes_FK FOREIGN KEY (user_hash) REFERENCES users(hash) ON DELETE CASCADE
		)`, (err) => { 
			if (err) {
				return reject("CRITICAL:: failed to create nodes table: " + err.message);
			} 
			// add external
			const params = [
				store.nodeName,
				store.node.hash,
				store.master.hash,
				defaults.ip4,
				defaults.router,
				defaults.bootstrap,
				defaults.stun,
				defaults.turn
			];
			database.run(`INSERT INTO nodes(name,hash,user_hash,ip4,router_port,bootstrap_port,stun_port,turn_port) VALUES (?,?,?,?,?,?,?,?)`, params, (err) => {
				if (err) {
					return reject("CRITICAL:: failed to insert defaults into a nodes table: " + err.message);
				} 
				resolve(true);
			});
		});
	});
}

/**
 * 
 * @param {Object} defaults router, bootstrap, dhtLookup, dhtAnnounce, external, autoDefine, ip4, stun, turn
 */
module.exports = (defaults) => { 
	return new Promise((resolve, reject) => {
		try {
			const path = homedir + "/.dogma-node/data.db"; // edit
			database = new sqlite3.Database(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
				if (err) { 
					reject("CRITICAL:: failed to create node.db: " + err.message);
				} else { 
					console.log("created empty db", path);
					try {
						await createParamsTable();
						await createUsersTable();
						await createNodesTable(defaults);
						await createConfigTable(defaults);
						emit("db-ready", true);
						console.log("created db tables");
					} catch (err) {
						return reject("DB INIT ERROR:: " + err);
					}
					resolve(true);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
}