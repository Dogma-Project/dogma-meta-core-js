const { emit, subscribe, services, state } = require("./state");
const { rprotocol } = require("./store");
const logger = require("../logger");
const { PROTOCOL, STATES } = require("./constants");

subscribe(["protocol-db"], (_action, value) => {
	if (value >= STATES.LIMITED) return; // don't trigger when status is loaded
	rprotocol().then((protocol) => {
		logger.info("migration", "protocol", protocol);
	}).catch((err) => { 
		emit("protocol-db", STATES.ERROR); // check
		logger.log("store", "read nodes db error::", err);
	});
});

subscribe(["protocol-DB"], (_action, value) => {
	try {
		if (value < PROTOCOL.DB) {
			const migration = require(`./migrations/migration-${value}.js`);
			migration(value).then((_result) => {
				emit("protocol-db", STATES.RELOAD);
			}).catch((err) => {
				logger.error("MIGRATION", "protocol-DB", 1, err);
			})
		} else {
			emit("protocol-db", STATES.FULL);
		}
	} catch (err) {
		logger.error("MIGRATION", "protocol-DB", 2, err);
	}
});