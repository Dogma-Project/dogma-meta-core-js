const bonjour = require('bonjour')();
const { store } = require("./store");
/**
 * 
 * @param {String} type dogma-router, dogma-dht
 * @param {Number} port 
 */
module.exports.localPublish = (type, port) => {
	try {
		return bonjour.publish({ 
			name: `${type}-${store.node.hash}`, 
			type, 
			port,
			txt: {
				hash: store.master.hash
			}
		});
	} catch (error) {
		console.error("BONJOUR P ERROR::", error);
	}
}

/**
 * 
 * @param {String} type dogma-router, dogma-dht
 * @param {Function} cb 
 */
module.exports.subscribe = (type, cb) => {
	try {
		const options = {
			type
		};
		return bonjour.find(options, cb);
	} catch (error) {
		console.error("BONJOUR S ERROR::", error);
	}
}