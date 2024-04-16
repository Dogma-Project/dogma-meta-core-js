import { fs, Buffer, crypto } from "@dogma-project/core-meta-be-node";
import { Keys } from "../types";
import logger from "./logger";
import dir from "./datadir";
import { C_Keys } from "../constants";
import generateCryptoKey from "./models/dbEncryption/generateCryptoKey";

type result = {
  publicKey: crypto.KeyObject;
  privateKey: crypto.KeyObject;
};
function _generateKeyPair(
  length: Keys.InitialParams["keylength"]
): Promise<result> {
  const options = {
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
  type: Keys.Types,
  length: Keys.Length = 2048
) {
  try {
    const { publicKey, privateKey } = await _generateKeyPair(length);
    const opts: crypto.KeyExportOptions<typeof C_Keys.FORMATS.FORMAT> = {
      // move to constants
      type: C_Keys.FORMATS.TYPE,
      format: C_Keys.FORMATS.FORMAT,
    };
    const publicKeyBuffer = publicKey.export(opts);
    const privateKeyBuffer = privateKey.export(opts);

    let private_str = "",
      public_str = "";
    if (type === C_Keys.Type.userKey) {
      private_str = dir.keys + "/master-private.pem";
      public_str = dir.keys + "/master-public.pem";
    } else if (type === C_Keys.Type.nodeKey) {
      private_str = dir.keys + "/node-private.pem";
      public_str = dir.keys + "/node-public.pem";
    } else {
      return Promise.reject("unknown key type");
    }
    await fs.writeFile(public_str, publicKeyBuffer);
    await fs.writeFile(private_str, privateKeyBuffer);
    return Promise.resolve(true);
  } catch (err) {
    logger.error("keys", err);
    return Promise.reject(err);
  }
}

export async function readOrCreateEncryptionKey(
  publicKey: Buffer,
  privateKey: Buffer
) {
  try {
    const privateMasterKey = crypto.createPrivateKey({
      key: privateKey,
      type: C_Keys.FORMATS.TYPE,
      format: C_Keys.FORMATS.FORMAT,
    });
    const key = await fs.readFile(dir.keys + "/encryption.key");
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
        await fs.writeFile(dir.keys + "/encryption.key", encrypted);
        return unencryped;
      } catch (err2: any) {
        logger.error("KEYS 1", err);
        return Promise.reject(err2);
      }
    } else {
      logger.error("KEYS 2", err);
      return Promise.reject(err);
    }
  }
}
