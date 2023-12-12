import crypto from "node:crypto";

/**
 * @todo check sizes, move to constants
 * @param length
 * @returns
 */
export default function generateCryptoKey(length: number = 32) {
  const bytesLength = length / 2;
  return crypto.randomBytes(bytesLength).toString("hex");
}
