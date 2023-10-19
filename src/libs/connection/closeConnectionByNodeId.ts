import { Connection } from "../../libs/model";
import ConnectionClass from "../connection";
import logger from "../../libs/logger";
import { Types } from "../../types";

export default async function closeConnecion(
  this: ConnectionClass,
  node_id: Types.Node.Id
) {
  const { peers } = this;
  // edit
  try {
    const result = await Connection.getConnDataByNodeId(node_id);
    const socket = peers[result.connection_id];
    peers[result.connection_id].destroy();
  } catch (err) {
    logger.error("connection.js", "closeConnectionByNodeId", err);
  }
}
