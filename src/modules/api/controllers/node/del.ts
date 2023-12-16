import { nodeModel } from "../../../../components/model";
import storage from "../../../../components/storage";
import { Node, User } from "../../../../types";
import logger from "../../../logger";

/**
 * If user_id and node_id not defined, returns own node
 * @todo can't delete own node
 * @param params
 */
export default async function DeleteNode(params: {
  user_id: User.Id;
  node_id: Node.Id;
}) {
  logger.debug("GET NODE!!", params);
  if (!params || !params.user_id || !params.node_id)
    return Promise.reject("Params not defined");
  if (!storage.user.id || !storage.node.id)
    return Promise.reject("Storage not defined");
  return nodeModel.removeNode(params.user_id, params.node_id);
}
