'use strict';
const { store } = require("./store");
const server = require("./server"); 
const {subscribe, services} = require("./state");

subscribe(["config-router", "users", "node-key"], (action, value) => { // edit
	const port = Number(store.config.router);
	if (!services.router) {
		server.listen(port); 
	} else {
		server.refresh(port);
	}	
}); 