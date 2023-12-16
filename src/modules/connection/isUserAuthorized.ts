import ConnectionClass from "../connections";
import * as Types from "../../types";
import { C_Event, C_Sync } from "@dogma-project/constants-meta";
import logger from "../logger";

export default async function isUserAuthorized(
  this: ConnectionClass,
  user_id: string
) {
  const model = this.modelsBridge[C_Sync.Type.users];
  if (!model) {
    logger.warn("Connections", "Users model not loaded");
    return null;
  }
  const inFriendsList = await model.get(user_id);
  if (!inFriendsList || !inFriendsList.user_id) return false;
  return !inFriendsList.requested;
}
