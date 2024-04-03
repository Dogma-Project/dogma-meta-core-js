import { C_Keys } from "../constants";
import crypto from "node:crypto";

export const createSha1Hash = (data: crypto.BinaryLike | string) => {
  const hash = crypto.createHash("sha1");
  hash.update(data);
  return hash.digest("hex");
};

export const createSha256Hash = (data: crypto.BinaryLike | string) => {
  const hash = crypto.createHash(C_Keys.HASH);
  hash.update(data);
  return hash.digest("hex");
};

export const signSha256Hash = (data: string, privateKey: crypto.KeyLike) => {
  try {
    const signature = crypto.createSign(C_Keys.HASH);
    signature.update(data);
    signature.end();
    return signature.sign(privateKey, "hex");
  } catch (_err) {
    return null;
  }
};

export const verifySha256Hash = (
  data: string,
  publicKey: crypto.KeyLike,
  sign: string
) => {
  try {
    const verification = crypto.createVerify(C_Keys.HASH);
    verification.update(data);
    verification.end();
    return verification.verify(publicKey, sign, "hex");
  } catch (_err) {
    return null;
  }
};
