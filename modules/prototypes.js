const logger = require("../logger");

String.prototype.toPlainHex = function () {
	try {
		const value = this;
		return value.replace(/:/g, "").toLowerCase();
	} catch (err) {
		logger.error("prototypes", "toPlainHex", err);
		return false;
	}
}

Array.prototype.unique = function () {
	try {
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}
		return this.filter(onlyUnique);
	} catch (err) {
		logger.error("prototypes", "unique", err);
		return false;
	}
};

module.exports = { String, Array };