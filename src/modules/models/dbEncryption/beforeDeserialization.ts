import crypto from "node:crypto";

export default function DecryptDb(ciphertext: string, key: string) {
  try {
    JSON.parse(ciphertext);
    return ciphertext; // if not encrypted
  } catch (e) {
    const ciphertextBytes = Buffer.from(ciphertext, "base64");
    const iv = ciphertextBytes.subarray(0, 16);
    const data = ciphertextBytes.subarray(16);
    const aes = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let plaintextBytes = Buffer.from(aes.update(data));
    plaintextBytes = Buffer.concat([plaintextBytes, aes.final()]);
    return plaintextBytes.toString();
  }
}
