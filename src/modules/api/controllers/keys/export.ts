import { C_Event } from "@dogma-project/constants-meta";
import stateManager from "../../../../components/state";
import storage from "../../../../components/storage";
import { Keys, Node, User } from "../../../../types";
import logger from "../../../logger";

/**
 *
 * @returns base64 encoded export key
 */
export default function exportUserKey() {
  if (storage.user.privateKey && storage.user.id) {
    const privKey = storage.user.privateKey.toString("hex");
    const users = stateManager.get<User.Model[]>(C_Event.Type.users) || [];
    const nodes = stateManager.get<Node.Model[]>(C_Event.Type.nodes) || [];
    const user = users.find((u) => u.user_id === storage.user.id);
    if (user) {
      const own_nodes = nodes.filter((n) => n.user_id === storage.user.id);
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
  return null;
}
