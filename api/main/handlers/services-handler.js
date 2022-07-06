function ServicesHandler() {
	this._on("services_get", "services_set", async (_data) => {
		return this.api.services.get();
	});
	
	this.ee.removeAllListeners("services"); // check
	this.ee.on("services", (_e) => {
		const result = this.api.services.get();
		this._broadcast("services_set", result);		
	});
}
module.exports = ServicesHandler;