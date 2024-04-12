import { crypto } from "@dogma-project/core-host-api";
import { Sync } from "../types";

/**
 * @param size *2
 */
const generateSyncId = (size: number = 6): Sync.Id => {
  size = Number(size) || 6;
  const time = new Date().getTime();
  return (
    crypto.randomBytes(size).toString("hex") + time.toString().slice(-size)
  );
};

export default generateSyncId;
