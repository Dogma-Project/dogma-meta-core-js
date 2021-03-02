'use strict';
var DHT = require('bittorrent-dht');
var store = require("./store"); 
const {tryPeer} = require("./nodes");
const {subscribe, emit, services} = require("./state");

global.dht = {
	object: false
}

function initDHT() { 
	console.log("INIT DHT");
	services.dhtBootstrap = 0;
	var bootstrapNodes = []; 
	var knownNodes = store.nodes; 
	knownNodes.forEach(node => {
		const port = Number(node.bootstrap_port);
		if (node.ip4 && port) bootstrapNodes.push(node.ip4 + ":" + port);
	});
	const params = {
		bootstrap: bootstrapNodes,
		concurrency: 16, // k-rpc option to specify maximum concurrent UDP requests allowed (Number, 16 by default)
		timeBucketOutdated: 900000, // check buckets every 15min
		maxAge: Infinity  // optional setting for announced peers to time out
	};
	if (global.dht.object) global.dht.object.destroy(); // if already
	global.dht.object = new DHT(params); 
	global.dht.object.on("warning", function (text) { 
		console.warn("DHT WARN::", text);
	});
	global.dht.object.on("error", function (text) { 
		console.error("DHT ERR::", text);
	});
	global.dht.object.on("announce", function (peer, infoHash) { 
		console.log("PEER ANNOUNCED", peer);
		tryPeer(peer, infoHash, true);
	});
	global.dht.object.on("peer", tryPeer);
	global.dht.object.on("ready", () => {
		emit("dht", 1);
		services.dht = 2;
	});
	global.dht.object.on("listening", () => {
		let port = global.dht.object.address().port;
		console.log("DHT listening on port:", port);
		emit("dht-bootstrap", port); // edit // add port checking
		services.dhtBootstrap = 1;
	});

	const port = Number(store.config.bootstrap);
	if (port) {
		console.log("DEFINE DHT PORT", port);
		global.dht.object.listen(port);
	}
}

subscribe(["nodes", "config-bootstrap"], initDHT);

// add server status check
subscribe(["dht", "master-key", "externalPort", "config-dhtAnnounce"], (action, value) => { // edit
	if (store.config.dhtAnnounce) {
		console.log(">>>>>>>>>> DHT ANNOUNCE", store.master.hash, Number(store.config.router));
		global.dht.object.announce(store.master.hash, Number(store.config.router));
	}
}); 