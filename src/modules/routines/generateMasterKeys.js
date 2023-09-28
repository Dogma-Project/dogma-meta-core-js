
const { pki, md, random, util } = require("node-forge");
const fs = require("fs"); // edit
const { publicKeyFingerprint, getPublicCertHash } = require("../crypt");
const { emit } = require("../state");
const logger = require("../../logger");
const { datadir } = require("../datadir");

const keysDir = datadir + "/keys";

/**
 * Master keys generator
 * @module GenerateMasterKeys
 */

/**
 * 
 * @param {Object} store main app's store
 * @param {Object} params
 * @param {Object} params.name 
 * @param {Number} params.length 
 * @param {String} params.seed check
 */
const generateMasterKeys = (store, params) => {
	try {
		logger.log("generate master keys", "Generating MK for", params.name, params.keylength);
		store.user.name = params.name;
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
		cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 93);

		const commonName = publicKeyFingerprint(keys.publicKey);
		const subject = [{
			name: 'commonName',
			value: commonName
		}, {
			name: 'organizationName',
			value: store.user.name
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

		store.user.key = Buffer.from(pki.privateKeyToPem(keys.privateKey));
		store.user.cert = Buffer.from(pki.certificateToPem(cert));
		store.user.id = getPublicCertHash(store.user.cert);
		fs.writeFile(keysDir + "/key.pem", store.user.key, (err) => {
			if (err) {
				logger.error("generate master keys", "Failed to write master key", err.name + ":" + err.message);
			} else {
				logger.log("generate master keys", "successfully wrote master key");
			}
		});
		fs.writeFile(keysDir + "/cert.pem", store.user.cert, (err) => {
			if (err) {
				logger.error("generate master keys", "Failed to write master cert", err.name + ":" + err.message);
			} else {
				logger.log("generate master keys", "successfully wrote master cert");
			}
		});
		emit("master-key", store.user);
		return {
			result: 1,
			error: null
		}
	} catch (err) {
		logger.error("generate master keys function", err);
		return {
			result: 0,
			error: err // edit
		}
	}
}

module.exports = generateMasterKeys;