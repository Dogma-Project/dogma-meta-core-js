import ConnectionClass from "../connections";
import * as Types from "../../types";
import { C_Event } from "@dogma-project/constants-meta";

export default function isUserAuthorized(
  this: ConnectionClass,
  user_id: string
) {
  const users = this.stateBridge.get<Types.User.Model[]>(C_Event.Type.users);
  if (!users) return null;
  const inFriendsList = users.find((user) => user.user_id === user_id);
  if (!inFriendsList) return false;
  return !inFriendsList.requested;
}
