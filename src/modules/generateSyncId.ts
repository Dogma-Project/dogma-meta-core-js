import { randomBytes } from "crypto";
import { Types } from "./types";

/**
 * @param size *2
 */
const generateSyncId = (size: number = 6): Types.Sync.Id => {
  size = Number(size) || 6;
  const time = new Date().getTime();
  return randomBytes(size).toString("hex") + time.toString().slice(-size);
};

export default generateSyncId;
module.exports = generateSyncId;
