import { Connection } from "../../libs/model";
import logger from "../../libs/logger";
import { EncodeStream } from "../streams";
import { Types } from "../../types";
import ConnectionClass from "../connection";

export default async function stream(
  this: ConnectionClass,
  node_id: Types.Node.Id,
  descriptor: number
) {
  try {
    const result = await Connection.getConnDataByNodeId(node_id);
    if (!result)
      return logger.warn("connection", "connection id didn't find", node_id); // edit try catch
    const socket = this.peers[result.connection_id];
    const encoder = new EncodeStream({
      highWaterMark: this.highWaterMark,
      descriptor,
    });
    encoder.on("error", (err) =>
      logger.error("connection", "stream encode error", err)
    );
    encoder.pipe(socket.multiplex.files, { end: false }); // edit
    return encoder;
  } catch (err) {
    logger.error("connection", "stream to node error::", err);
  }
}
