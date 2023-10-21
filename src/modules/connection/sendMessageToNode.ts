import { Connection } from "../model";
import messages from "../messages";
import { MSG_FORMAT, MSG_CODE } from "../../constants";
import logger from "../logger";
import FilesController from "../controllers/files";
import { Types } from "../../types";
import ConnectionClass from "../connection";
import response from "./response";

export default async function send(
  this: ConnectionClass,
  node_id: Types.Node.Id,
  message: Types.Message.Class.Abstract,
  type: Types.Message.Type = Types.Message.Type.direct
) {
  // edit // add read status message

  try {
    const result = await Connection.getConnDataByNodeId(node_id);
    if (!result) return response(-1, MSG_CODE.UNKNOWN); // edit try catch
    const { user_id, connection_id } = result;
    const socket = this.peers[connection_id];
    let { text, files } = message;
    text = text || "";
    files = files || [];

    /** attachments */
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const { descriptor, pathname } =
          await FilesController.permitFileTransfer({ user_id, file });
        files[i] = { ...file, descriptor, pathname };
      } catch (err) {
        logger.error("sendMessageToNode", "permit file transfer", err);
      }
    }
    const filesData = files.map((file) => {
      const { name, size, type, descriptor } = file;
      return { name, size, type, descriptor };
    });
    const id = type === MESSAGES.DIRECT ? node_id : user_id;
    const sync_id = await messages.commit({
      id,
      text,
      files: filesData,
      direction: DIRECTION.OUTCOMING,
      format: MSG_FORMAT.COMMON,
      type,
    });
    socket.multiplex.messages.write(
      JSON.stringify({
        text,
        files: filesData,
        type,
      })
    );
    return response(sync_id, MSG_CODE.SUCCESS);
  } catch (err) {
    logger.error("connection", "SEND TO NODE::", err);
    return response(-1, MSG_CODE.ERROR, "can't send message"); // edit !!!
  }
}
