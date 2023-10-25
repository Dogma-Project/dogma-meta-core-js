import { MSG_CODE } from "../../constants";
import logger from "../logger";
import * as Types from "../../types";
import Connections from "../connections";
import response from "./response";

export default function send(
  this: Connections,
  request: Types.Request,
  node_id: Types.Node.Id
) {
  try {
    const socket = this.getConnectionByNodeId(node_id);
    if (!socket) return response(1, MSG_CODE.UNKNOWN, "user is offline"); // edit
    switch (request.class) {
      case Types.Streams.MX.dht:
        socket.input.dht.write(JSON.stringify(request.body));
        return response(1, MSG_CODE.SUCCESS);
      default:
        request; // dummy
        break;
    }
  } catch (err) {
    logger.error("connection", "SEND TO NODE::", err);
    return response(1, MSG_CODE.ERROR, "can't send request"); // edit text
  }
}
