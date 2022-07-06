function ConfigHandler() {

	this._on("config_get", "config_set", async (_data) => {
		return this.api.config.get();
	});
	this._handle("config_set", async (data) => {
		return this.api.config.set(data);
	});

}

module.exports = ConfigHandler;