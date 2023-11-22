import crypto from "node:crypto";

/**
 * handle exceptions
 * @param data
 * @returns
 */
export const createSha256Hash = (data: crypto.BinaryLike | string) => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
};
