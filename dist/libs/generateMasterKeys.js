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
 * Master keys generator
 * @module GenerateMasterKeys
 */
const generateMasterKeys = (store, params) => {
    try {
        logger_1.default.log("generate master keys", "Generating MK for", params.name, params.keylength);
        store.user.name = params.name;
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
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 93);
        const commonName = (0, crypto_1.publicKeyFingerprint)(keys.publicKey);
        const subject = [
            {
                name: "commonName",
                value: commonName,
            },
            {
                name: "organizationName",
                value: store.user.name,
            },
        ];
        cert.setSubject(subject);
        cert.setIssuer(subject);
        cert.setExtensions([
            {
                name: "basicConstraints",
                cA: true,
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
        cert.sign(keys.privateKey, node_forge_1.md.sha256.create());
        store.user.key = Buffer.from(node_forge_1.pki.privateKeyToPem(keys.privateKey));
        store.user.cert = Buffer.from(node_forge_1.pki.certificateToPem(cert));
        store.user.id = (0, crypto_1.getPublicCertHash)(store.user.cert.toString()) || "Unknown"; // edit
        node_fs_1.default.writeFile(keysDir + "/key.pem", store.user.key, (err) => {
            if (err) {
                logger_1.default.error("generate master keys", "Failed to write master key", err.name + ":" + err.message);
            }
            else {
                logger_1.default.log("generate master keys", "successfully wrote master key");
            }
        });
        node_fs_1.default.writeFile(keysDir + "/cert.pem", store.user.cert, (err) => {
            if (err) {
                logger_1.default.error("generate master keys", "Failed to write master cert", err.name + ":" + err.message);
            }
            else {
                logger_1.default.log("generate master keys", "successfully wrote master cert");
            }
        });
        (0, state_1.emit)("master-key", store.user);
        return {
            result: 1,
            error: null,
        };
    }
    catch (err) {
        logger_1.default.error("generate master keys function", err);
        return {
            result: 0,
            error: err, // edit
        };
    }
};
exports.default = generateMasterKeys;
