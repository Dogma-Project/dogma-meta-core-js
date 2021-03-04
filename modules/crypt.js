'use strict';
const {pki, asn1, md} = require("node-forge");
const model = require("./model");

const crypt = {
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
        } catch (e) {
            console.error("Can't get certificate hash");
        }
    },

	publicKeyFingerprint: (publicKey) => {
		return pki.getPublicKeyFingerprint(publicKey, {
			md: md.sha256.create(),
			encoding: 'hex'
		});
	},

	/**
	 * 
	 * @param {Array} nodes result of getOwnNodes
	 */
    getDogmaCertificate: (nodes) => {
		return new Promise( async (resolve, reject) => { 
			try {
				var { store } = require("./store");
				var dogmaCert = {
					pubKey: store.master.cert.toString("utf-8"),
				}
				dogmaCert.nodes = nodes || [];
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
	 */
	validateCommonName(commonName, publicKey) { 
		try {
			const publicKeyFingerprint = this.publicKeyFingerprint(publicKey);
			console.log("Validate commonName", commonName, publicKeyFingerprint);
			return (commonName === publicKeyFingerprint);
		} catch (err) {
			console.error("validateCommonName", err);
			return false;
		}
	},

	/**
	 * 
	 * @param {String} cert b64
	 */
	validateDogmaCertificate(cert) { 

		var { store } = require("./store");
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
				console.error("UNKNOWN CERT", err);
				return error("error validating certificate:: unknown cert");
			}
			if (!this.validateCommonName(commonName, cert.publicKey)) {
				return error("fake commonName!");
			}
			const user_hash = crypt.getPublicCertHash(object.pubKey);
			const own = Number(user_hash == store.master.hash);
			if (object.nodes && object.nodes.length > 0) {
				var fake = 0;
				object.nodes.forEach((node) => {
					if (node.user_hash !== user_hash) fake ++;
					// check input data
				});
				if (fake) return error("fake nodes");
				object.nodes = object.nodes.filter((node) => {
					return !(store.node.hash == node.hash);
				});
				// if (own && !object.nodes.length) return error("can't add own cert"); // return after tests

				// console.log("userName!!!!!!!", userName);
				return {
					result: 1,
					error: null,
					hash: user_hash,
					cert: object.pubKey,
					nodes: object.nodes,
					own,
					name: userName
				}
			} else {
				console.log("absense of node data");
			}

        } catch (err) { 
			console.error(err);
			return error("error validating certificate");
        }

	},

	/**
	 * 
	 * @param {Object} data result of certificate validation
	 * @return {Boolean} result
	 */
    addDogmaCertificate: async (data) => { // add response
		try {
			const result1 = await model.persist("users", {
				name: data.name,
				hash: data.hash,
				cert: data.cert,
				type: Number(!data.own)
			});
			const result2 = await model.persist("nodes", data.nodes);
			return (result1 && result2);
		} catch (err) {
			console.error("cert adding error", err);
			return false;
		}
    }
}

module.exports = crypt;