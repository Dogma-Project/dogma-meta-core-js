'use strict';
const {pki,md,random,util} = require("node-forge");
const homedir = require('os').homedir();
const fs = require("fs"); // edit
const {publicKeyFingerprint, getPublicCertHash} = require("../crypt");
const {emit} = require("../state");

/**
 * 
 * @param {Object} store 
 * @param {Object} params name,length,seed
 */
module.exports = (store, params) => { 
	try {
		console.log("Generating Node Keys for", params.name, params.keylength);
		var masterKey = pki.privateKeyFromPem(store.master.key);
		var masterCert = pki.certificateFromPem(store.master.cert);

		store.nodeName = params.name;
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
		cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 68);

		const commonName = publicKeyFingerprint(keys.publicKey);
		const subject = [{
			name: 'commonName',
			value: commonName
		}, {
			name: 'organizationName',
			value: store.nodeName
		}];

		cert.setSubject(subject);
		cert.setIssuer(masterCert.subject.attributes);
		cert.setExtensions([{
			name: 'basicConstraints',
			cA: false
		}, {
			name: 'keyUsage',
			keyCertSign: true,
			digitalSignature: true,
			nonRepudiation: true,
			keyEncipherment: true,
			dataEncipherment: true
		}]);

		cert.sign(masterKey, md.sha256.create());
		store.node.key	= Buffer.from(pki.privateKeyToPem(keys.privateKey));
		store.node.cert	= Buffer.from(pki.certificateToPem(cert));
		store.node.hash	= getPublicCertHash(store.node.cert, true);
		console.log("HASH", store.node.hash);
		fs.writeFile(homedir + "/.dogma-node/node-key.pem", store.node.key, (err) => {
			if (err) {
				console.error("Failed to write node key", err.name + ":" + err.message);
			} else {
				console.log("successfully wrote node key")
			}
		});
		fs.writeFile(homedir + "/.dogma-node/node-cert.pem", store.node.cert, (err) => {
			if (err) {
				console.error("Failed to write node cert", err.name + ":" + err.message);
			} else {
				console.log("successfully wrote node cert")
			}
		});
		emit("node-key", store.node);
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