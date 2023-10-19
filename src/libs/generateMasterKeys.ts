import { pki, md, random, util } from "node-forge";
import fs from "node:fs"; // edit
import { publicKeyFingerprint, getPublicCertHash } from "./crypto";
import { emit } from "./state";
import logger from "./logger";
import { datadir } from "../components/datadir";
import { Types } from "../types";

const keysDir = datadir + "/keys";

/**
 * Master keys generator
 * @module GenerateMasterKeys
 */

const generateMasterKeys = (
  store: Types.Store,
  params: Types.Key.InitialParams
) => {
  try {
    logger.log(
      "generate master keys",
      "Generating MK for",
      params.name,
      params.keylength
    );
    store.user.name = params.name;
    if (params.seed) {
      // EDIT !!!!
      // random.collect(util.createBuffer(params.seed, "utf8"));
      var rand = random.createInstance();
      var keys = pki.rsa.generateKeyPair({
        bits: Number(params.keylength),
        prng: rand,
      });
    } else {
      var keys = pki.rsa.generateKeyPair({
        bits: Number(params.keylength),
      });
    }
    var cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 93
    );

    const commonName = publicKeyFingerprint(keys.publicKey);
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

    cert.sign(keys.privateKey, md.sha256.create());

    store.user.key = Buffer.from(pki.privateKeyToPem(keys.privateKey));
    store.user.cert = Buffer.from(pki.certificateToPem(cert));
    store.user.id = getPublicCertHash(store.user.cert.toString()) || "Unknown"; // edit
    fs.writeFile(keysDir + "/key.pem", store.user.key, (err) => {
      if (err) {
        logger.error(
          "generate master keys",
          "Failed to write master key",
          err.name + ":" + err.message
        );
      } else {
        logger.log("generate master keys", "successfully wrote master key");
      }
    });
    fs.writeFile(keysDir + "/cert.pem", store.user.cert, (err) => {
      if (err) {
        logger.error(
          "generate master keys",
          "Failed to write master cert",
          err.name + ":" + err.message
        );
      } else {
        logger.log("generate master keys", "successfully wrote master cert");
      }
    });
    emit("master-key", store.user);
    return {
      result: 1,
      error: null,
    };
  } catch (err) {
    logger.error("generate master keys function", err);
    return {
      result: 0,
      error: err, // edit
    };
  }
};

export default generateMasterKeys;
