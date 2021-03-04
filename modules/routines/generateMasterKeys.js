'use strict';
const {pki,md,random,util} = require("node-forge");
const fs = require("fs"); // edit
const {publicKeyFingerprint, getPublicCertHash} = require("../crypt");
const {emit} = require("../state");

const keysDir = global.datadir + "/keys";

/**
 * 
 * @param {Object} store 
 * @param {Object} params name,length,seed
 */
module.exports = (store, params) => { 
	try {
		console.log("Generating Master Keys for", params.name, params.keylength);
		store.name = params.name;
		var rand = random.createInstance();
		rand.collect(util.createBuffer(params.seed, 'utf8'));
		var keys = pki.rsa.generateKeyPair({
			bits: Number(params.keylength),
			prng: rand
		});
		var cert = pki.createCertificate();
		cert.publicKey = keys.publicKey;
		cert.validity.notBefore = new Date();
		cert.validity.notAfter = new Date();
		cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 93);

		const commonName = publicKeyFingerprint(keys.publicKey);
		const subject = [{
			name: 'commonName',
			value: commonName
		}, {
			name: 'organizationName',
			value: store.name
		}];

		cert.setSubject(subject);
		cert.setIssuer(subject);
		cert.setExtensions([{
			name: 'basicConstraints',
			cA: true
		}, {
			name: 'keyUsage',
			keyCertSign: true,
			digitalSignature: true,
			nonRepudiation: true,
			keyEncipherment: true,
			dataEncipherment: true
		}]);

		cert.sign(keys.privateKey, md.sha256.create());

		store.master.key	= Buffer.from(pki.privateKeyToPem(keys.privateKey));
		store.master.cert	= Buffer.from(pki.certificateToPem(cert));
		store.master.hash	= getPublicCertHash(store.master.cert);
		fs.writeFile(keysDir + "/key.pem", store.master.key, (err) => {
			if (err) {
				console.error("Failed to write master key", err.name + ":" + err.message);
			} else {
				console.log("successfully wrote master key")
			}
		});
		fs.writeFile(keysDir + "/cert.pem", store.master.cert, (err) => {
			if (err) {
				console.error("Failed to write master cert", err.name + ":" + err.message);
			} else {
				console.log("successfully wrote master cert")
			}
		});
		emit("master-key", store.master);
		return {
			result: 1,
			error: null
		}
	} catch (err) {
		console.error(err);
		return {
			result: 0,
			error: err // edit
		}
	}
}