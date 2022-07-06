function FilesHandler() {

	this._on("files_push", "files_push", async (data) => {
		return this.api.files.push(data);
	});
	this._handle("files_get", async (data) => {
		return this.api.files.get(data);
	});
	this._handle("files_delete", async (data,) => {
		return this.api.files.delete(data);
	});

	this.ee.removeAllListeners("file-transfer");
	this.ee.on("file-transfer", (e) => {
		this._broadcast("files_set", {
			code: 1, // edit
			data: e
		});
	});

}

module.exports = FilesHandler;