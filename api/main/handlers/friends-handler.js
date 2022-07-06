function FriendsHandler() {

	this._on("friends_get", "friends_set", async (_data) => {
		return this.api.friends.get();
	});
	this._handle("friends_delete", async (data) => {
		console.log("API", "delete friend", data)
		return this.api.friends.delete(data);
	});

	this.ee.removeAllListeners("friends"); // check
	this.ee.on("friends", (_e) => {
		const result = this.api.friends.get();
		this._broadcast("friends_set", result);
	});

}

module.exports = FriendsHandler;