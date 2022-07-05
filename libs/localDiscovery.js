const dgram = require("dgram");
const EventEmitter = require("events");
const os = require('os');
const ifaces = os.networkInterfaces();

/** @module LocalDiscovery */

/**
 * 
 * @param {String} ip "192.168.0.2"
 */
const convertToBroadcast = (ip) => { 
	if (ip === "0.0.0.0") return "255.255.255.0"; // fallback
	ip = ip.split(".");
	ip[3] = "255"; // broadcast
	ip = ip.join(".");
	return ip;
}

/**
 * 
 * @param {String} ip "192.168.0.2"
 */
const getLocalAddress = (ip = "") => { 
	const pattern = "192.168.";
	let address, broadcast;
	if (ip.indexOf(pattern) === -1) {
		Object.keys(ifaces).forEach((ifname) => {
			ifaces[ifname].forEach((iface) => {
				if (iface.family !== "IPv4" || iface.internal !== false || iface.address.indexOf(pattern) === -1) return;
				address = iface.address;
			});
		});
		if (!address) {
			console.warn("Local Discovery Lib", "can't determine local address. fallback to 0.0.0.0");
			address = "0.0.0.0";
		}
	} else {
		address = ip;
	}
	broadcast = convertToBroadcast(address);
    return { address, broadcast };
}

class LocalDiscovery extends EventEmitter {
	
	/**
	 * 
	 * @param {Object} params
	 * @param {Number} params.port default: 45432
	 * @param {String} params.ip default: 0.0.0.0
	 */
	constructor({ port = 45432, ip }) {
		super();
		const { address, broadcast } = getLocalAddress(ip);
		// this.ip = address;
		this.ip = "0.0.0.0";
		this.port = port; 
		this.broadcast = broadcast;
	}

	startServer() {
		this.server = dgram.createSocket({
			type: "udp4",
			reuseAddr: true
		});
		this.server.on("listening", () => {
			const address = this.server.address();
			this.emit("ready", {
				address
			});
		});
		this.server.on("message", (msg, from) => { 
			const decoded = JSON.parse(msg.toString());
			this.emit("message", {
				msg: decoded, 
				from
			});
		});
		this.server.on("error", err => this.emit("error", {
			type: "server",
			err
		}));

		this.server.bind({
			port: this.port,
			address: this.ip
		}, () => {
			this.server.setBroadcast(true);
		});

		return this;
	}

	/**
	 * 
	 * @param {Object} card 
	 * @param {String} card.type
	 * @param {String} card.user_id
	 * @param {String} card.node_id
	 * @param {Number} card.port
	 */
	announce(card) {
		const message = Buffer.from(JSON.stringify(card));
		this.server.send(message, 0, message.length, this.port, this.broadcast, (err, bytes) => { 
			if (err) { 
				this.emit("error", {
					type: "client",
					err
				});
			} else {
				console.log("sent broadcast message to", this.broadcast, this.port);
			}
		});
		return this;
	}

}

module.exports = LocalDiscovery;