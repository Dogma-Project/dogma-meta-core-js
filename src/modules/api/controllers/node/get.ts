import { nodeModel } from "../../../../components/model";
import storage from "../../../../components/storage";
import { Node, User } from "../../../../types";
import logger from "../../../logger";

/**
 * If user_id and node_id not defined, returns own node
 * @param params
 */
export default async function GetNode(params: {
  user_id?: User.Id;
  node_id?: Node.Id;
}) {
  logger.debug("GET NODE!!", params);
  if (!params || !params.user_id || !params.node_id) {
    if (!storage.user.id || !storage.node.id) return Promise.reject(null);
    params = {
      user_id: storage.user.id,
      node_id: storage.node.id,
    };
  }
  if (params.user_id && params.node_id) {
    const result = await nodeModel.get(params.user_id, params.node_id);
    if (result) return result;
  } else {
    logger.warn("API NODE", "Can't get node");
    // warn
  }
  return Promise.reject(null);
}
