
const { pki, asn1, md } = require("node-forge");
const { User, Node } = require("./model");
const logger = require("../logger");

/** @module Crypt */

const crypt = module.exports = {

	/**
	 * 
	 * @param {Object} pemCert 
	 * @param {Boolean} formatted 
	 * @returns {String}
	 * @todo certificateFromPem-> computeHash
	 * @todo delete formatted
	 */
	getPublicCertHash: (pemCert, formatted) => {
		try {
			/* convert pem to der */
			const cert = pki.certificateFromPem(pemCert);
			const certAsn1 = pki.certificateToAsn1(cert);
			const certDer = asn1.toDer(certAsn1).getBytes();
			/* convert pem to der */

			/* get sha256 fingerprint */
			var hash = md.sha256.create();
			hash.start();
			hash.update(certDer);
			const fingerprint = hash.digest().toHex();
			/* get sha256 fingerprint */

			if (!formatted) return fingerprint;
			return fingerprint.match(/.{2}/g)
				.join(':')
				.toUpperCase();
		} catch (err) {
			logger.error("crypt.js", "get public cert hash", err);
		}
	},

	/**
	 * 
	 * @param {Object} publicKey // check
	 * @returns {String}
	 */
	publicKeyFingerprint: (publicKey) => {
		return pki.getPublicKeyFingerprint(publicKey, {
			md: md.sha256.create(),
			encoding: 'hex'
		});
	},

	/**
	 * Generate base64 Dogma certificate
	 * @param {Object} store
	 * @param {Object} store.config
	 * @param {Number} store.config.router
	 * @param {Object} store.user
	 * @param {Buffer} store.user.cert
	 * @param {Object} store.node
	 * @param {String} store.node.name
	 * @param {String} store.node.id
	 * @param {String} store.node.public_ipv4
	 * @returns {Promise} 
	 */
	getDogmaCertificate: (store) => {
		return new Promise(async (resolve, reject) => {
			try {
				/** @todo document */
				const dogmaCert = {
					pubKey: store.user.cert.toString("utf-8"),
					node: {
						name: store.node.name,
						node_id: store.node.id,
						public_ipv4: store.node.public_ipv4,
						port: store.config.router
					}
				}
				const result = Buffer.from(JSON.stringify(dogmaCert)).toString("base64");
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	},

	/**
	 * 
	 * @param {String} commonName 
	 * @param {Object} publicKey 
	 * @returns {Boolean} result
	 */
	validateCommonName(commonName, publicKey) {
		try {
			const publicKeyFingerprint = this.publicKeyFingerprint(publicKey);
			logger.log("crypt.js", "Validate commonName", commonName, publicKeyFingerprint);
			return (commonName === publicKeyFingerprint);
		} catch (err) {
			logger.error("crypt.js", "validateCommonName", err);
			return false;
		}
	},

	/**
	 * 
	 * @param {String} pem node cert 
	 * @todo checkings and validation
	 */
	getNamesFromNodeCert(pem) {
		const cert = pki.certificateFromPem(pem);
		return {
			user_name: cert.issuer.getField('O').value,
			node_name: cert.subject.getField('O').value
		}
	},

	/**
	 * Validate and parse base64 certificate
	 * @param {String} cert base64 { pubKey, public_ipv4, port }
	 * @param {String} user_id own user_id
	 * @returns {Object} result, error, "user_id", "name", {cert}, {node}, !!own
	 */
	validateDogmaCertificate(cert, user_id) {

		const error = (reason) => {
			return {
				result: 0,
				error: reason
			}
		}

		try {

			const json = Buffer.from(cert, 'base64').toString("utf-8");
			var object = JSON.parse(json);
			try {
				var cert = pki.certificateFromPem(object.pubKey);
				var userName = cert.subject.getField('O').value;
				var commonName = cert.subject.getField('CN').value;
			} catch (err) {
				logger.error("crypt.js", "UNKNOWN CERT", err);
				return error("error validating certificate:: unknown cert");
			}
			if (!this.validateCommonName(commonName, cert.publicKey)) {
				return error("fake commonName!");
			}
			if (!object.node || !object.node.node_id) {
				return error("unknown node data in cert!");
			}

			const user_hash = crypt.getPublicCertHash(object.pubKey);
			const own = Number(user_hash == user_id);

			return {
				result: 1,
				error: null,
				user_id: user_hash,
				name: userName,
				cert: object.pubKey,
				node: {
					name: object.node.name,
					node_id: object.node.node_id.toPlainHex(),
					public_ipv4: object.node.public_ipv4,
					port: object.node.port
				},
				own
			}

		} catch (err) {
			logger.error("crypt.js", "validateDogmaCertificate", err);
			return error("error validating certificate");
		}

	},

	/**
	 * Persist parsed result of validateDogmaCertificate function
	 * @param {Object} data result of certificate validation
	 * @param {String} data.name
	 * @param {String} data.user_id
	 * @param {String} data.cert
	 * @param {Number} data.own
	 * @param {Object} data.node
	 * @param {String} data.node.name 
	 * @param {String} data.node.node_id 
	 * @param {String} data.node.public_ipv4 
	 * @param {Number} data.node.port 
	 * @return {Promise} result:boolean
	 */
	addDogmaCertificate: async (data) => { // add response
		let result1, result2, user, node;
		try {
			user = {
				name: data.name,
				user_id: data.user_id,
				cert: data.cert,
				type: Number(!data.own)
			};
			result1 = await User.persistUser(user);
		} catch (err) {
			logger.debug("crypt.js", user);
			logger.error("crypt.js", "cert adding error", 1, err);
			return false;
		}
		try {
			node = {
				name: data.node.name,
				node_id: data.node.node_id,
				user_id: data.user_id,
				public_ipv4: data.node.public_ipv4,
				router_port: data.node.port
			}
			result2 = await Node.persistNodes([node]);
		} catch (err) {
			logger.debug("crypt.js", node);
			logger.error("crypt.js", "cert adding error", 2, err);
			return false;
		}
		return (result1 && result2);
	}
} 