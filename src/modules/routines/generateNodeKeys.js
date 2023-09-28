
const { pki, md, random, util } = require("node-forge");
const fs = require("fs"); // edit
const { publicKeyFingerprint, getPublicCertHash } = require("../crypt");
const { emit } = require("../state");
const logger = require("../../logger");
const { datadir } = require("../datadir");

const keysDir = datadir + "/keys";

/**
 * Node keys generator
 * @module GenerateNodeKeys
 */

/**
	 * 
	 * @param {Object} store main app's store
	 * @param {Object} params
	 * @param {Object} params.name 
	 * @param {Number} params.length 
	 * @param {String} params.seed check
 */
const generateNodeKeys = (store, params) => {
	try {
		logger.log("generate node keys", "Generating NK for", params.name, params.keylength);
		var masterKey = pki.privateKeyFromPem(store.user.key);
		var masterCert = pki.certificateFromPem(store.user.cert);
		store.node.name = params.name;

		if (params.seed) {
			var rand = random.createInstance();
			rand.collect(util.createBuffer(params.seed, 'utf8'));
			var keys = pki.rsa.generateKeyPair({
				bits: Number(params.keylength),
				prng: rand
			});
		} else {
			var keys = pki.rsa.generateKeyPair({
				bits: Number(params.keylength)
			});
		}

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
			value: store.node.name
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
		store.node.key = Buffer.from(pki.privateKeyToPem(keys.privateKey));
		store.node.cert = Buffer.from(pki.certificateToPem(cert));
		store.node.id = getPublicCertHash(store.node.cert);
		fs.writeFile(keysDir + "/node-key.pem", store.node.key, (err) => {
			if (err) {
				logger.error("generate node keys", "Failed to write node key", err.name + ":" + err.message);
			} else {
				logger.log("generate node keys", "successfully wrote node key")
			}
		});
		fs.writeFile(keysDir + "/node-cert.pem", store.node.cert, (err) => {
			if (err) {
				logger.error("generate node keys", "Failed to write node cert", err.name + ":" + err.message);
			} else {
				logger.log("generate node keys", "successfully wrote node cert")
			}
		});
		emit("node-key", store.node);
		return {
			result: 1,
			error: null
		}
	} catch (err) {
		logger.error("generate node keys function", err);
		return {
			result: 0,
			error: err // edit
		}
	}
}

module.exports = generateNodeKeys;