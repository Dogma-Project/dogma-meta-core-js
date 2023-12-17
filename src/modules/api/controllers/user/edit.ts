import { userModel } from "../../../../components/model";
import { User } from "../../../../types";

export default function EditUser(params: User.Model) {
  if (!params || !params.user_id) return Promise.reject("Params not defined");
  const query: User.Model = {
    user_id: params.user_id,
    name: params.name,
  };
  return userModel.persistUser(query);
}
