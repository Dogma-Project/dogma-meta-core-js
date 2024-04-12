import storage from "../../../../components/storage";
import { nodeModel, userModel } from "../../../../components/model";
import { Keys } from "../../../../types";
import logger from "../../../logger";
import { Buffer } from "@dogma-project/core-host-api";

/**
 *
 * @returns base64 encoded export key
 */
export default async function exportUserKey() {
  try {
    if (storage.user.privateKey && storage.user.id) {
      const privKey = storage.user.privateKey.toString("hex");
      const user = await userModel.get(storage.user.id);
      if (user) {
        const own_nodes = await nodeModel.getByUserId(storage.user.id);
        const result: Keys.ExportFormat = {
          key: privKey,
          user,
          nodes: own_nodes,
        };
        return Buffer.from(JSON.stringify(result)).toString("base64");
      } else {
        logger.warn("export key", "User not found");
      }
    }
    return Promise.reject(null); // edit
  } catch (err) {
    return Promise.reject(err);
  }
}
