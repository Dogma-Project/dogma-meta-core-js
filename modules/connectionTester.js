var store = require("./store");
const db = require("./db");
const {test} = require("./client");
const {emit} = require("./state");

const getExternalIp4 = () => { 
	return new Promise((resolve, reject) => { 
		try {
			var extServices = store.config.external.split("\n").map((item) => {
				return item.trim();
			});
			console.log("EXT SERVICES", extServices);
			var extIP = require("ext-ip")({
				mode           : "parallel",
				replace        : true,
				timeout        : 500,
				userAgent      : "curl/ext-ip-getter",
				followRedirect : true,
				maxRedirects   : 10,
				services       : extServices
			});
		} catch (err) {
			return reject(err);
		}
		extIP.get().then(resolve).catch(error => {
			if (store.node.ip4 && store.node.ip4 !== '127.0.0.1') {
				resolve(store.node.ip4);
			} else {
				console.error(error);
				reject("can't get public ip");
			}
		})
		
	});
}

const testExternalIp4 = (ip) => {
	return new Promise((resolve, reject) => {
		if (store.node.ip4 === ip) {
			resolve(true);
		} else {
			db.run("UPDATE nodes SET ip4 = ? WHERE hash = ?", [ip, store.node.hash]).then(() => {
				store.node.ip4 = ip;
				resolve(true);
			}).catch(reject);
		}
	});
}

const testExternalPort = () => {
	const peer = {
		host: store.node.ip4,
		port: store.config.router
	};
	test(peer, result => {
		if (result) {
			emit("server", 2);
		} else { 
			emit("server", 1);
			console.log("router external port is closed");
		}
	})
}

module.exports.check = () => {
	if (store.config.autoDefine) {
		getExternalIp4().then(testExternalIp4).then(testExternalPort).catch(console.error);
	} else { 
		if (!!store.config.ip4) {
			testExternalIp4(store.config.ip4).then(testExternalPort).catch(console.error);
		} else {
			console.warn("CONNECTION TESTER::", "undefined ip4");
		}
	}
}