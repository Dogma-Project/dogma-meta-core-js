global.datadir = require('os').homedir() + "/.dogma-node/testdatadir";

var expect    = require("chai").expect;
const fs = require("fs");

describe("database", function() {
	
	// delete old testing databases
	fs.rmdirSync(global.datadir + "/db", { recursive: true });

	const { temp } = require("../modules/nedb");
	describe("check", function() {
		it("insert rows", (done) => {
			temp.insert([{ a: 5 }, { a: 42 }], function (err, newDocs) {
				expect(err).equals(null);
				expect(newDocs).to.have.lengthOf(2);
				done();
			});
		});
		it("find row", (done) => {
			temp.find({a : 5}, function (err, val) {
				expect(err).equals(null);
				expect(val).to.have.lengthOf(1);
				done();
			});
		});		
	});

	describe("create", function() {
		const { createDataBase, cconfig, cusers, cnodes } = require("../modules/routines/createDataBase");

		const store = {
			name: "123456789",
			nodeName: "123456789",
			master: {
				hash: "123456789",
				cert: Buffer.from("123456789")
			},
			node: {
				hash: "123456789"
			},
		}
		const defaults = {
			router: 24601,
			bootstrap: 0,
			dhtLookup: 1,
			dhtAnnounce: 1,
			external: "http://ifconfig.io/ip \nhttp://whatismyip.akamai.com/ \nhttp://ipv4bot.whatismyipaddress.com \nhttp://api.ipify.org \nhttp://trackip.net/ip \nhttp://diagnostic.opendns.com/myip",
			autoDefine: 1,
			ip4: "127.0.0.1",
			stun: 0,
			turn: 0
		}

		it("config", (done) => {
			cconfig(defaults).then((result) => { 
				expect(result).to.have.lengthOf(9);
				done();
			}).catch((error) => {
				expect(error).to.be.a('null');
				done();
			});
		});	

		it("users", (done) => {
			cusers(store).then((result) => {
				expect(result).to.be.an('object');
				expect(result).to.have.a.property('hash');
				done();
			}).catch((error) => {
				expect(error).to.be.a('null');
				done();
			});
		});	

		it("nodes", (done) => {
			cnodes(store, defaults).then((result) => {
				expect(result).to.be.an('object');
				expect(result).to.have.a.property('hash');
				expect(result).to.have.a.property('user_hash');
				done();
			}).catch((error) => {
				expect(error).to.be.a('null');
				done();
			});
		});	

		// it("complete", (done) => {
		// 	createDataBase(defaults, store).then((result) => {
		// 		expect(result).equals(1);
		// 		done();
		// 	}).catch((error) => {
		// 		expect(error).to.be.a('null');
		// 		done();
		// 	});
		// });	

		const { rconfig, rusers, rnodes } = require("../modules/store");

		it("read config", (done) => { 
			rconfig().then((result) => {
				expect(result).to.be.an('array');
				done();
			}).catch((err) => {
				expect(err).to.be.a('null');
				done();
			})
		});	

		it("read users", (done) => { 
			rusers().then((result) => {
				expect(result).to.be.an('array');
				done();
			}).catch((err) => {
				expect(err).to.be.a('null');
				done();
			})
		});	

		it("read nodes", (done) => { 
			rnodes().then((result) => {
				expect(result).to.be.an('array');
				done();
			}).catch((err) => {
				expect(err).to.be.a('null');
				done();
			})
		});	

		const { getOwnNodes } = require("../modules/nodes");

		it("get own nodes", (done) => { 
			getOwnNodes().then((result) => {
				expect(result).to.be.an('array');
				done();
			}).catch((err) => {
				expect(err).to.be.a('null');
				done();
			})
		});	

	});

}); 

describe("temp", function() {

	const { connections, directMessages } = require("../modules/nedb");

	describe("connections", function() {

		const address = "256.256.256.256:65536";

		it("insert connections", (done) => {
			const doc = {
				connection_id: "1234-1234-1234-1234",
				device_id: "H:0:H:0:H:0", 
				address: "256.256.256.256:65536"
			}
			connections.insert(doc, function (err, newDocs) {
				expect(err).equals(null);
				expect(newDocs).to.be.an('object');
				expect(newDocs).to.have.a.property('address');
				done();
			});
		});

		it("connection count", (done) => {
			const { getcc } = require("../modules/nodes");
			getcc(address).then((result) => {
				expect(result).to.be.a('number');
				expect(result).equals(1);
				done();
			}).catch((err) => {
				expect(err).equals(null);
				done();
			})
		});		

	});

});