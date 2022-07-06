function KeysGeneratorHandler() {
	
	this._handle("masterKey_set", (data) => { 
		return this.api.masterKey.set(data);
	});
	this._handle("nodeKey_set", (data) => {
		return this.api.nodeKey.set(data);
	});

}

module.exports = KeysGeneratorHandler;