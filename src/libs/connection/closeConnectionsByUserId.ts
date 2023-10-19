import { Connection } from "../../libs/model";
import logger from "../../libs/logger";
import { emit } from "../state";
import ConnectionClass from "../connection";
import { Types } from "../../types";

export default async function closeConnecion(
  this: ConnectionClass,
  user_id: Types.User.Id
) {
  const { peers } = this;
  try {
    const result = await Connection.getConnDataByUserId(user_id);
    for (const row of result) {
      peers[row.connection_id].destroy();
    }
    emit("update-user", false);
  } catch (err) {
    logger.error("connection.js", "closeConnectionsByUserId", err);
  }
}
