'use strict';
var tls = require('tls');
var connection = require("./connection");
var { store } = require("./store");
const {services, emit, subscribe} = require("./state");
const localDiscovery = require("./localDiscovery");
const connectionTester = require("./connectionTester");

const getOptions = () => {
	return {
		key: store.node.key,
		cert: store.node.cert,
		ca: store.ca,
		requestCert: true,
		rejectUnauthorized: true
	}	
}

const server = { 
	ss: {},
	port: 0,
	service: null,
	sockets: [],
    listen: (port) => { 
		server.ss.port = port; // check
        server.ss = tls.createServer(getOptions(), (socket) => { 
			server.sockets.push(socket);
            if (socket.authorized) {
				console.log("Server connection authorized by a CA.");
				connection.onConnect(socket, socket.remoteAddress + ":" + socket.remotePort); // edit
            } else { // edit
            	return console.log("Server connection not authorized: " + socket.authorizationError)
			}
			socket.on('close', () => { 
				connection.onClose(socket);
			});
			socket.on('error', (e) => { 
				console.warn("socket server error 1", e);
			});
            // add onEnd
        });

        server.ss.listen(port, "0.0.0.0", () => { 
			try { // edit!
				server.service = localDiscovery.localPublish("dogma-router", port);
			} catch (err) {
				console.error("bonjour announce error::", err);
			}
			emit("server", 1);
            console.log("I'm listening at", port);
        });
        server.ss.on('error', (error) => { 
			emit("server", 0); // check
            console.error("!!!!!!!", "SOCKET SERVER ERROR", error);
		});
        server.ss.on('close', () => { 
			// fires only when all connections will close
            console.error("SOCKET SERVER CLOSED");
		});
	},
	stop: (cb) => {
		if (server.service && server.service.stop) server.service.stop();
		emit("server", 0);
		server.ss.close();
		cb();
	},
	refresh: (port) => { 
		if (port != server.ss.port) {
			server.stop(() => {
				server.listen(port);
			});
		} else {
			server.ss.setSecureContext(getOptions());
		}
	}

} 

subscribe(["server"], (_action, state) => {
	services.router = state;
});

subscribe(["server", "config-autoDefine", "config-external", "config-ip4"], (_action, _state) => {
	const state = services.router;
	console.log("IP STATE", state);
	switch (state) {
		case 1:
			connectionTester.check();
		break;
		case 2:
			emit("externalPort", Number(store.config.router));
		break;
	}
});


module.exports = server;