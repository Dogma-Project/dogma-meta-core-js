const EventEmitter = require("./eventEmitter");

let state = {};
let listeners = [];
const services = {};

/**
 * 
 * @param {Array} type 
 * @param {Function} callback 
 */
let subscribe = (type, callback) => { 
	type.forEach((key) => { 
		if (listeners[key] === undefined) listeners[key] = [];
		listeners[key].push([type, callback]);
	})
}

/**
 * 
 * @param {String} type 
 * @param {*} payload 
 */
let emit = (type, payload) => { 
	let action = 'update';
	if (listeners[type] === undefined) return console.warn("key isn't registered", type); // edit
	if (state[type] === undefined) action = 'set';
	if (JSON.stringify(state[type]) === JSON.stringify(payload)) return console.warn("nothing to emit", type);
	state[type] = payload;
	listeners[type].forEach((entry) => {
		let ready = entry[0].every((val) => (state[val] !== undefined));
		ready && entry[1](action, payload, type); // edit
	});

}

const servicesHandler = {
	get: (obj, prop) => {
		return obj[prop];
	},
	set: (obj, prop, value) => {
		if (obj[prop] === value) return true;
		obj[prop] = value;
		EventEmitter.emit("services", obj);
		return true;
	}
}

module.exports.state = state;
module.exports.subscribe = subscribe;
module.exports.emit = emit;
module.exports.services = new Proxy(services, servicesHandler);