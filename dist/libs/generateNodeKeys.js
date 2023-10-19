"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_forge_1 = require("node-forge");
const node_fs_1 = __importDefault(require("node:fs")); // edit
const crypto_1 = require("./crypto");
const state_1 = require("./state");
const logger_1 = __importDefault(require("./logger"));
const datadir_1 = require("../components/datadir");
const keysDir = datadir_1.datadir + "/keys";
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
        logger_1.default.log("generate node keys", "Generating NK for", params.name, params.keylength);
        if (!store.user.key || !store.user.cert)
            throw "user cert or key not available";
        var masterKey = node_forge_1.pki.privateKeyFromPem(store.user.key.toString());
        var masterCert = node_forge_1.pki.certificateFromPem(store.user.cert.toString());
        store.node.name = params.name;
        if (params.seed) {
            // EDIT !!!!
            // random.collect(util.createBuffer(params.seed, "utf8"));
            var rand = node_forge_1.random.createInstance();
            var keys = node_forge_1.pki.rsa.generateKeyPair({
                bits: Number(params.keylength),
                prng: rand,
            });
        }
        else {
            var keys = node_forge_1.pki.rsa.generateKeyPair({
                bits: Number(params.keylength),
            });
        }
        var cert = node_forge_1.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 68);
        const commonName = (0, crypto_1.publicKeyFingerprint)(keys.publicKey);
        const subject = [
            {
                name: "commonName",
                value: commonName,
            },
            {
                name: "organizationName",
                value: store.node.name,
            },
        ];
        cert.setSubject(subject);
        cert.setIssuer(masterCert.subject.attributes);
        cert.setExtensions([
            {
                name: "basicConstraints",
                cA: false,
            },
            {
                name: "keyUsage",
                keyCertSign: true,
                digitalSignature: true,
                nonRepudiation: true,
                keyEncipherment: true,
                dataEncipherment: true,
            },
        ]);
        cert.sign(masterKey, node_forge_1.md.sha256.create());
        store.node.key = Buffer.from(node_forge_1.pki.privateKeyToPem(keys.privateKey));
        store.node.cert = Buffer.from(node_forge_1.pki.certificateToPem(cert));
        store.node.id = (0, crypto_1.getPublicCertHash)(store.node.cert.toString()) || "Unknown"; // edit
        node_fs_1.default.writeFile(keysDir + "/node-key.pem", store.node.key, (err) => {
            if (err) {
                logger_1.default.error("generate node keys", "Failed to write node key", err.name + ":" + err.message);
            }
            else {
                logger_1.default.log("generate node keys", "successfully wrote node key");
            }
        });
        node_fs_1.default.writeFile(keysDir + "/node-cert.pem", store.node.cert, (err) => {
            if (err) {
                logger_1.default.error("generate node keys", "Failed to write node cert", err.name + ":" + err.message);
            }
            else {
                logger_1.default.log("generate node keys", "successfully wrote node cert");
            }
        });
        (0, state_1.emit)("node-key", store.node);
        return {
            result: 1,
            error: null,
        };
    }
    catch (err) {
        logger_1.default.error("generate node keys function", err);
        return {
            result: 0,
            error: err, // edit
        };
    }
};
exports.default = generateNodeKeys;
