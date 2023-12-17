import { userModel } from "../../../../components/model";
import storage from "../../../../components/storage";
import { User } from "../../../../types";
import logger from "../../../logger";

/**
 * If user_id not defined, returns own user
 * @param params
 */
export default async function GetUser(params: { user_id?: User.Id }) {
  logger.debug("GET USER!!", params);
  if (!params || !params.user_id) {
    if (!storage.user.id)
      return Promise.reject("Can't get user. Storage not initialized");
    params = {
      user_id: storage.user.id,
    };
  }
  if (params.user_id) {
    const result = await userModel.get(params.user_id);
    if (result) return result;
  } else {
    return Promise.reject("Can't get node");
  }
  return Promise.reject(null);
}
