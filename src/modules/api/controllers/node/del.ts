import { nodeModel } from "../../../../components/model";
import storage from "../../../../components/storage";
import { Node, User } from "../../../../types";
import logger from "../../../logger";

/**
 *
 * @param params
 */
export default async function DeleteNode(params: {
  user_id: User.Id;
  node_id: Node.Id;
}) {
  logger.debug("DEL NODE!!", params);
  if (!params || !params.user_id || !params.node_id)
    return Promise.reject("Params not defined");
  if (!storage.user.id || !storage.node.id)
    return Promise.reject("Storage not defined");
  if (
    storage.user.id === params.user_id &&
    storage.node.id === params.node_id
  ) {
    return Promise.reject("Can't delete self node");
  }
  return nodeModel.removeNode(params.user_id, params.node_id);
}
