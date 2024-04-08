import { userModel } from "../../../../components/model";
import storage from "../../../../components/storage";
import { User } from "../../../../types";
import logger from "../../../logger";

/**
 * @todo delete all user's nodes
 * @param params
 */
export default async function DeleteNode(params: { user_id: User.Id }) {
  logger.debug("DEL USER!!", params);
  if (!params || !params.user_id) return Promise.reject("Params not defined");
  if (!storage.user.id) return Promise.reject("Storage not defined");
  if (storage.user.id === params.user_id) {
    return Promise.reject("Can't delete own user");
  }
  return userModel.removeUser(params.user_id);
}
