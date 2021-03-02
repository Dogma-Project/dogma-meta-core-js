'use strict';
var tls = require('tls');
var connection = require("./connection");
var store = require("./store");

var client = { 
    connect: (peer) => { 
		try {
			var options = { 
				key: store.node.key,
				cert: store.node.cert,
				ca: store.ca,
				requestCert: true,
				rejectUnauthorized: true,
				checkServerIdentity: () => { return null; },
				servername: undefined
			}
            var socket = tls.connect(peer.port, peer.host, options, () => {
				if (socket.authorized) {
					console.log("Client connection authorized by a CA.");
					connection.onConnect(socket, peer.host + ":" + peer.port);
				} else { // edit
					return console.log("Client connection not authorized: " + socket.authorizationError); // check
				}
			});
			socket.on('close', () => { 
				connection.onClose(socket);
			});        
			socket.on("error", error => { 
				console.log(error.errno, error.address + ":" + error.port);
			});    
		} catch (e) {
			console.error("Can't establish connection", e);
		}
	},

    test: (peer, cb) => { 
		try {
			var options = { 
				key: store.node.key,
				cert: store.node.cert,
				ca: store.ca,
				requestCert: true,
				rejectUnauthorized: true,
				checkServerIdentity: () => { return null; },
				servername: undefined
			}
            var socket = tls.connect(peer.port, peer.host, options, () => {
				console.log("TEST CONNECTION SUCCESSFUL");
				socket.destroy();
				cb(true);
			});
			socket.on('close', () => { 
				console.log("TEST CONNECTION CLOSED");
			});        
			socket.on("error", error => { 
				console.log("TEST CONNECTION ERROR");
				cb(false);
			});    
		} catch (e) {
			console.error("Can't establish connection", e);
		}
	}
	
} 

module.exports = client;