import { User } from "../../../../types";
/**
 * If user_id not defined, returns own user
 * @param params
 */
export default function GetUser(params: {
    user_id?: User.Id;
}): Promise<User.Model>;
