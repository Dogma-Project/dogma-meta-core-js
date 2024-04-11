import { userModel } from "../../../../components/model";
import storage from "../../../../components/storage";
import { User } from "../../../../types";
import logger from "../../../logger";

/**
 * If user_id not defined, returns own user
 * @todo check return
 * @param params
 */
export default async function GetUser(params: { user_id?: User.Id }) {
  if (!params || !params.user_id) {
    if (!storage.user.id)
      return Promise.reject("Can't get user. Storage not initialized");
    params = {
      user_id: storage.user.id,
    };
  }
  if (params.user_id) {
    const result = await userModel.get(params.user_id);
    if (result) {
      return {
        ...result,
        self: result.user_id === storage.user.id,
      };
    }
  } else {
    return Promise.reject("Can't get user");
  }
  return Promise.reject(null);
}
