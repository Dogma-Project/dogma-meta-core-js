function MessagesHandler() {

	this._on("messages_get", "messages_set", async (data) => {
		return this.api.messages.get(data);
	});
	this._handle("messages_push", async (data) => {
		return this.api.messages.push(data);
	});

	this.ee.removeAllListeners("messages");
	this.ee.on("messages", (data) => {
		this._broadcast("messages_push", data);
	});

}

module.exports = MessagesHandler;