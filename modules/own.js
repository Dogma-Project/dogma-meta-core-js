'use strict';
// const { store } = require("./store");
const server = require("./server"); 
const {subscribe, services, state} = require("./state");

subscribe(["config-router", "users", "node-key"], (action, value) => { // edit
	const port = state["config-router"];
	if (!services.router) {
		server.listen(port); 
	} else {
		server.refresh(port);
	}	
}); 