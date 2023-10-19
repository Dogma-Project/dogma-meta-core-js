import { pki, asn1, md } from "node-forge";
import { User, Node } from "./model";
import logger from "./logger";
import { Types } from "../types";

/** @module Crypt */

/**
 *
 * @param {Object} pemCert
 * @param {Boolean} formatted
 * @returns {String}
 * @todo certificateFromPem-> computeHash
 * @todo delete formatted
 */
export const getPublicCertHash = (pemCert: string, formatted?: boolean) => {
  try {
    /* convert pem to der */
    const cert = pki.certificateFromPem(pemCert);
    const certAsn1 = pki.certificateToAsn1(cert);
    const certDer = asn1.toDer(certAsn1).getBytes();
    /* convert pem to der */

    /* get sha256 fingerprint */
    const hash = md.sha256.create();
    // hash.start();
    hash.update(certDer);
    const fingerprint = hash.digest().toHex();
    /* get sha256 fingerprint */

    if (!formatted) return fingerprint;
    const matched = fingerprint.match(/.{2}/g);
    if (matched === null) throw "not match";
    return matched.join(":").toUpperCase();
  } catch (err) {
    logger.error("crypt.js", "get public cert hash", err);
  }
};

export const publicKeyFingerprint = (publicKey: pki.PublicKey) => {
  return pki.getPublicKeyFingerprint(publicKey, {
    md: md.sha256.create(),
    encoding: "hex",
  });
};

/**
 * Generate base64 Dogma certificate
 */
export const getDogmaCertificate = (store: Types.Store) => {
  return new Promise(async (resolve, reject) => {
    try {
      /** @todo document */
      if (store.user.cert === null) return reject("Empty cert");
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
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param {String} commonName
 * @param {Object} publicKey
 * @returns {Boolean} result
 */
export const validateCommonName = (
  commonName: string,
  publicKey: pki.PublicKey
) => {
  try {
    const publicFingerprint = publicKeyFingerprint(publicKey);
    logger.log(
      "crypt.js",
      "Validate commonName",
      commonName,
      publicFingerprint
    );
    return commonName === publicFingerprint;
  } catch (err) {
    logger.error("crypt.js", "validateCommonName", err);
    return false;
  }
};

/**
 *
 * @param pem node cert
 * @todo checkings and validation
 */
export const getNamesFromNodeCert = (pem: string) => {
  const cert = pki.certificateFromPem(pem);
  return {
    user_name: cert.issuer.getField("O").value,
    node_name: cert.subject.getField("O").value,
  };
};

/**
 * Validate and parse base64 certificate
 * @param {String} cert base64 { pubKey, public_ipv4, port }
 * @param {String} user_id own user_id
 * @returns {Object} result, error, "user_id", "name", {cert}, {node}, !!own
 */
export const validateDogmaCertificate = (
  certB64: string,
  user_id: Types.User.Id
) => {
  const error = (reason: any) => {
    return {
      result: 0,
      error: reason,
    };
  };

  try {
    const json = Buffer.from(certB64, "base64").toString("utf-8");
    const object = JSON.parse(json);
    const cert = pki.certificateFromPem(object.pubKey);
    const userName = cert.subject.getField("O").value;
    const commonName = cert.subject.getField("CN").value;
    if (!validateCommonName(commonName, cert.publicKey)) {
      return error("fake commonName!");
    }
    if (!object.node || !object.node.node_id) {
      return error("unknown node data in cert!");
    }

    const user_hash = getPublicCertHash(object.pubKey);
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
  } catch (err) {
    logger.error("crypt.js", "validateDogmaCertificate", err);
    return error("error validating certificate");
  }
};

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
export const addDogmaCertificate = async (
  data: Types.Certificate.Validation.Result
) => {
  // add response
  let result1, result2;
  const user: Types.User.Model = {
    name: data.name,
    user_id: data.user_id,
  };
  const node: Types.Node.Model = {
    name: data.node.name,
    node_id: data.node.node_id,
    user_id: data.user_id,
    public_ipv4: data.node.public_ipv4,
  };
  try {
    result1 = await User.persistUser(user);
  } catch (err) {
    logger.error("crypt.js", "cert adding error", 1, err);
    return false;
  }
  try {
    result2 = await Node.persistNodes([node]);
  } catch (err) {
    logger.error("crypt.js", "cert adding error", 2, err);
    return false;
  }
  return result1 && result2;
};
