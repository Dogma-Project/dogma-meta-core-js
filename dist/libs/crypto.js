"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDogmaCertificate = exports.validateDogmaCertificate = exports.getNamesFromNodeCert = exports.validateCommonName = exports.getDogmaCertificate = exports.publicKeyFingerprint = exports.getPublicCertHash = void 0;
const node_forge_1 = require("node-forge");
const model_1 = require("./model");
const logger_1 = __importDefault(require("./logger"));
/** @module Crypt */
/**
 *
 * @param {Object} pemCert
 * @param {Boolean} formatted
 * @returns {String}
 * @todo certificateFromPem-> computeHash
 * @todo delete formatted
 */
const getPublicCertHash = (pemCert, formatted) => {
    try {
        /* convert pem to der */
        const cert = node_forge_1.pki.certificateFromPem(pemCert);
        const certAsn1 = node_forge_1.pki.certificateToAsn1(cert);
        const certDer = node_forge_1.asn1.toDer(certAsn1).getBytes();
        /* convert pem to der */
        /* get sha256 fingerprint */
        const hash = node_forge_1.md.sha256.create();
        // hash.start();
        hash.update(certDer);
        const fingerprint = hash.digest().toHex();
        /* get sha256 fingerprint */
        if (!formatted)
            return fingerprint;
        const matched = fingerprint.match(/.{2}/g);
        if (matched === null)
            throw "not match";
        return matched.join(":").toUpperCase();
    }
    catch (err) {
        logger_1.default.error("crypt.js", "get public cert hash", err);
    }
};
exports.getPublicCertHash = getPublicCertHash;
const publicKeyFingerprint = (publicKey) => {
    return node_forge_1.pki.getPublicKeyFingerprint(publicKey, {
        md: node_forge_1.md.sha256.create(),
        encoding: "hex",
    });
};
exports.publicKeyFingerprint = publicKeyFingerprint;
/**
 * Generate base64 Dogma certificate
 */
const getDogmaCertificate = (store) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            /** @todo document */
            if (store.user.cert === null)
                return reject("Empty cert");
            const dogmaCert = {
                pubKey: store.user.cert.toString("utf-8"),
                node: {
                    name: store.node.name,
                    node_id: store.node.id,
                    public_ipv4: store.node.public_ipv4,
                    port: store.config.router,
                },
            };
            const result = Buffer.from(JSON.stringify(dogmaCert)).toString("base64");
            resolve(result);
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.getDogmaCertificate = getDogmaCertificate;
/**
 *
 * @param {String} commonName
 * @param {Object} publicKey
 * @returns {Boolean} result
 */
const validateCommonName = (commonName, publicKey) => {
    try {
        const publicFingerprint = (0, exports.publicKeyFingerprint)(publicKey);
        logger_1.default.log("crypt.js", "Validate commonName", commonName, publicFingerprint);
        return commonName === publicFingerprint;
    }
    catch (err) {
        logger_1.default.error("crypt.js", "validateCommonName", err);
        return false;
    }
};
exports.validateCommonName = validateCommonName;
/**
 *
 * @param pem node cert
 * @todo checkings and validation
 */
const getNamesFromNodeCert = (pem) => {
    const cert = node_forge_1.pki.certificateFromPem(pem);
    return {
        user_name: cert.issuer.getField("O").value,
        node_name: cert.subject.getField("O").value,
    };
};
exports.getNamesFromNodeCert = getNamesFromNodeCert;
/**
 * Validate and parse base64 certificate
 * @param {String} cert base64 { pubKey, public_ipv4, port }
 * @param {String} user_id own user_id
 * @returns {Object} result, error, "user_id", "name", {cert}, {node}, !!own
 */
const validateDogmaCertificate = (certB64, user_id) => {
    const error = (reason) => {
        return {
            result: 0,
            error: reason,
        };
    };
    try {
        const json = Buffer.from(certB64, "base64").toString("utf-8");
        const object = JSON.parse(json);
        const cert = node_forge_1.pki.certificateFromPem(object.pubKey);
        const userName = cert.subject.getField("O").value;
        const commonName = cert.subject.getField("CN").value;
        if (!(0, exports.validateCommonName)(commonName, cert.publicKey)) {
            return error("fake commonName!");
        }
        if (!object.node || !object.node.node_id) {
            return error("unknown node data in cert!");
        }
        const user_hash = (0, exports.getPublicCertHash)(object.pubKey);
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
                port: object.node.port,
            },
            own,
        };
    }
    catch (err) {
        logger_1.default.error("crypt.js", "validateDogmaCertificate", err);
        return error("error validating certificate");
    }
};
exports.validateDogmaCertificate = validateDogmaCertificate;
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
const addDogmaCertificate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // add response
    let result1, result2;
    const user = {
        name: data.name,
        user_id: data.user_id,
    };
    const node = {
        name: data.node.name,
        node_id: data.node.node_id,
        user_id: data.user_id,
        public_ipv4: data.node.public_ipv4,
    };
    try {
        result1 = yield model_1.User.persistUser(user);
    }
    catch (err) {
        logger_1.default.error("crypt.js", "cert adding error", 1, err);
        return false;
    }
    try {
        result2 = yield model_1.Node.persistNodes([node]);
    }
    catch (err) {
        logger_1.default.error("crypt.js", "cert adding error", 2, err);
        return false;
    }
    return result1 && result2;
});
exports.addDogmaCertificate = addDogmaCertificate;
