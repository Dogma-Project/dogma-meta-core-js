'use strict';
const { store } = require("./store");
const client = require("./client");
const {subscribe} = require("./state");
// const localDiscovery = require("./localDiscovery");
const EventEmitter = require("./eventEmitter");
const { users, nodes, connections } = require("./nedb");

var peers = {};
var interval1,interval2;

function searchFriends() {
	store.users.forEach(user => dhtLookup(user.hash));
}

function connectFriends() { 
	store.nodes.forEach((node) => connect(node));
}

function dhtLookup(key) { 
	try { 
		// check dht lookup status
		// console.log("LOOKUP", key);
		global.dht.object.lookup(key, (e, founded) => {});
	} catch (e) {
		console.error("DHT lookup error", e);
	}
}

function connect(node) { // edit
	if (node.ip4) {
		tryPeer({
			host: node.ip4,
			port: node.router_port
		}, false, true);
	}
}

/**
 * 
 * @param {Object} peer 
 * @param {*} infoHash 
 * @param {*} from 
 */
function tryPeer(peer, infoHash, from) { // check non-listed peers
	if (!from || peer.host == "127.0.0.1") return;
	if (!peer.host) return console.warn("unknown peer host");
	if (!peer.port) return console.warn("unknown peer port");
	if (infoHash) {
		var pubkey = infoHash;
		if (typeof infoHash !== 'string') {
			pubkey = pubkey.toString('hex'); 
		} 
		const inFriends = store.users.find(user => user.hash === pubkey);
		console.log("PUBKEY", pubkey, !!inFriends);
		if (!inFriends) return console.log("pubkey", pubkey, "not in the friends list");
	}
	const address = peer.host + ":" + peer.port;
	getConnectionsCount(address).then((count) => {
		if (count === 0) client.connect(peer);
	}).catch((err) => {
		console.error(err);
	});
}

/**
 * 
 * @param {String} address host:port
 */
const getConnectionsCount = (address) => {
	return new Promise((resolve, reject) => {
		connections.find({ address }, (err, result) => {
			if (err) return reject(err);
			resolve(result.length);
		});
	})
}

const getOwnNodes = () => { 
	return new Promise((resolve, reject) => {
		users.find({ type: 0}, (err, result) => {
			if (err) return reject(err);
			// can be only one own user
			const uhash = result[0].hash;
			nodes.find({ user_hash: uhash }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		})
	});
}

// localDiscovery.subscribe("dogma-router", (service) => {
// 	if (service.txt && service.txt.hash) {
// 		console.log("trying to connect local service", service.host);
// 		tryPeer({
// 			host: service.addresses[0],
// 			port: service.port
// 		}, service.txt.hash, true);
// 	}
// });


subscribe(["nodes", "users"], (_action) => { // edit 
	EventEmitter.emit("friends", true);
	clearInterval(interval1);
	connectFriends();
	interval1 = setInterval(connectFriends, 60000); // edit
});

subscribe(["dht", "config-dhtLookup", "users"], (action) => { // edit
	clearInterval(interval2);
	if (store.config.dhtLookup) {
		searchFriends();
		interval2 = setInterval(searchFriends, 30000);	 // edit
	}
});

module.exports.tryPeer = tryPeer;
module.exports.peers = peers;
module.exports.getOwnNodes = getOwnNodes;
module.exports.getcc = getConnectionsCount;