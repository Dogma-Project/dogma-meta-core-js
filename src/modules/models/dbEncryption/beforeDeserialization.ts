import crypto from "node:crypto";

export default function DecryptDb(ciphertext: string, key: string) {
  try {
    JSON.parse(ciphertext);
    return ciphertext; // if not encrypted
  } catch (e) {
    const ciphertextBytes = Buffer.from(ciphertext, "base64");
    const iv = ciphertextBytes.subarray(0, 16); // move to constants
    const data = ciphertextBytes.subarray(16); // move to constants
    const aes = crypto.createDecipheriv("aes-256-cbc", key, iv); // move to constants
    let plaintextBytes = Buffer.from(aes.update(data));
    // aes.end(); // check if needed
    plaintextBytes = Buffer.concat([plaintextBytes, aes.final()]);
    return plaintextBytes.toString();
  }
}
