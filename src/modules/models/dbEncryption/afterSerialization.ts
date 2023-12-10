import crypto from "node:crypto";

export default function EncryptDb(plaintext: string, key: string) {
  const iv = crypto.randomBytes(16);
  const aes = crypto.createCipheriv("aes-256-cbc", key, iv);
  let ciphertext = aes.update(plaintext);
  ciphertext = Buffer.concat([iv, ciphertext, aes.final()]);
  return ciphertext.toString("base64");
}
