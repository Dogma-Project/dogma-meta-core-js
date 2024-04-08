import { userModel } from "../../../../components/model";
import { User } from "../../../../types";

export default function EditUser(params: User.Model) {
  if (!params || !params.user_id) return Promise.reject("Params not defined");
  const allowed = ["user_id", "name", "requested"];
  for (const param in params) {
    if (!allowed.includes(param)) {
      delete params[param];
    }
  }
  return userModel.persistUser(params);
}
