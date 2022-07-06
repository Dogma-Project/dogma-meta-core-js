function ConnectionsHandler() {
    this._on("connections_get", "connections_set", async (_data) => {
        return this.api.connections.get();
    });

    this.ee.removeAllListeners("connections"); // check
    this.ee.on("connections", async (_e) => {
        const result = await this.api.connections.get();
        this._broadcast("connections_set", result);
    });
}
module.exports = ConnectionsHandler;