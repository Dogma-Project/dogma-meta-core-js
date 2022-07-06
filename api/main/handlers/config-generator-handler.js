function ConfigGeneratorHandler() {

	this._handle("defaults_set", async (data) => {
		return this.api.database.set(data);
	});

}

module.exports = ConfigGeneratorHandler;