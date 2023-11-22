import crypto, { RSAKeyPairKeyObjectOptions } from "node:crypto";
import { Keys } from "../types";
import logger from "./logger";
import fs from "node:fs";
import { keysDir } from "./datadir";

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
  type: Keys.Type,
  length: Keys.InitialParams["keylength"] = 2048
) {
  try {
    const { publicKey, privateKey } = await _generateKeyPair(length);
    const opts: crypto.KeyExportOptions<"pem"> = {
      type: Keys.FORMATS.TYPE,
      format: Keys.FORMATS.FORMAT,
    };
    const publicKeyBuffer = publicKey.export(opts);
    const privateKeyBuffer = privateKey.export(opts);

    let private_str = "",
      public_str = "";
    if (type === Keys.Type.masterKey) {
      private_str = keysDir + "/master-private.pem";
      public_str = keysDir + "/master-public.pem";
    } else if (type === Keys.Type.nodeKey) {
      private_str = keysDir + "/node-private.pem";
      public_str = keysDir + "/node-public.pem";
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
