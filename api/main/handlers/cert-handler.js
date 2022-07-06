function CertHandler() {
	this._on("cert_get", "cert_set", async (_data) => {
		return this.api.certificate.get();
	});
	this._handle("cert_push", async (data) => {
		return this.api.certificate.push(data);
	});
}

module.exports = CertHandler;