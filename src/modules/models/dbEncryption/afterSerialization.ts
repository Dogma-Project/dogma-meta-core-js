import { Buffer } from "node:buffer";
import crypto from "node:crypto";

export default function EncryptDb(plaintext: string, key: string) {
  const iv = crypto.randomBytes(16); // move to constants
  const aes = crypto.createCipheriv("aes-256-cbc", key, iv); // move to constants
  let ciphertext = aes.update(plaintext);
  // aes.end(); // check if needed
  ciphertext = Buffer.concat([iv, ciphertext, aes.final()]);
  return ciphertext.toString("base64");
}
