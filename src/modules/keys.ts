import crypto, { RSAKeyPairKeyObjectOptions } from "node:crypto";
import { Keys } from "../types";
import logger from "./logger";
import fs from "node:fs";
import { getDatadir } from "./datadir";
import { C_Keys } from "@dogma-project/constants-meta";
import generateCryptoKey from "./models/dbEncryption/generateCryptoKey";

type result = {
  publicKey: crypto.KeyObject;
  privateKey: crypto.KeyObject;
};
function _generateKeyPair(
  length: Keys.InitialParams["keylength"]
): Promise<result> {
  const options: RSAKeyPairKeyObjectOptions = {
    modulusLength: length,
  };
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      "rsa",
      options,
      (
        err: Error | null,
        publicKey: crypto.KeyObject,
        privateKey: crypto.KeyObject
      ) => {
        if (err) return reject(err);
        return resolve({ privateKey, publicKey });
      }
    );
  });
}

export async function createKeyPair(
  type: C_Keys.Type,
  prefix: string,
  length: Keys.InitialParams["keylength"] = 2048
) {
  try {
    const dir = getDatadir(prefix);
    const { publicKey, privateKey } = await _generateKeyPair(length);
    const opts: crypto.KeyExportOptions<"pem"> = {
      type: C_Keys.FORMATS.TYPE,
      format: C_Keys.FORMATS.FORMAT,
    };
    const publicKeyBuffer = publicKey.export(opts);
    const privateKeyBuffer = privateKey.export(opts);

    let private_str = "",
      public_str = "";
    if (type === C_Keys.Type.masterKey) {
      private_str = dir.keys + "/master-private.pem";
      public_str = dir.keys + "/master-public.pem";
    } else if (type === C_Keys.Type.nodeKey) {
      private_str = dir.keys + "/node-private.pem";
      public_str = dir.keys + "/node-public.pem";
    } else {
      return Promise.reject("unknown key type");
    }
    fs.writeFileSync(public_str, publicKeyBuffer);
    fs.writeFileSync(private_str, privateKeyBuffer);
    return Promise.resolve(true);
  } catch (err) {
    logger.error("keys", err);
    return Promise.reject(err);
  }
}

export async function readOrCreateEncryptionKey(
  prefix: string,
  publicKey: Buffer,
  privateKey: Buffer
) {
  const dir = getDatadir(prefix);
  try {
    const privateMasterKey = crypto.createPrivateKey({
      key: privateKey,
      type: C_Keys.FORMATS.TYPE,
      format: C_Keys.FORMATS.FORMAT,
    });
    const key = await fs.promises.readFile(dir.keys + "/encryption.key");
    if (!key || !key.length) throw { code: "ENOENT" };
    const result = crypto.privateDecrypt(privateMasterKey, key);
    return result.toString();
  } catch (err: any) {
    if (err.code === "ENOENT") {
      try {
        const publicMasterKey = crypto.createPublicKey({
          key: publicKey,
          type: C_Keys.FORMATS.TYPE,
          format: C_Keys.FORMATS.FORMAT,
        });
        const unencryped = generateCryptoKey(32); // edit;
        const buffer = Buffer.from(unencryped, "utf-8");
        const encrypted = crypto.publicEncrypt(publicMasterKey, buffer);
        await fs.promises.writeFile(dir.keys + "/encryption.key", encrypted);
        return unencryped;
      } catch (err2: any) {
        logger.error("KEYS 1", err);
        return Promise.reject(err2);
      }
    } else {
      logger.error("KEYS", err);
      return Promise.reject(err);
    }
  }
}
