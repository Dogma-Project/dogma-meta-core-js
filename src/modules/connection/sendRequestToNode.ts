import { MSG_CODE } from "../../constants";
import logger from "../logger";
import * as Types from "../../types";
import Connections from "../connections";
import response from "./response";
import { C_Streams } from "@dogma-project/constants-meta";

export default function send(
  this: Connections,
  request: Types.Request,
  node_id: Types.Node.Id
) {
  try {
    logger.log("Connection", "Sending request to node", node_id);
    const socket = this.getConnectionByNodeId(node_id);
    if (!socket) return response(1, MSG_CODE.UNKNOWN, "user is offline"); // edit
    switch (request.class) {
      case C_Streams.MX.dht:
        var str = JSON.stringify(request.body);
        socket.input.dht && socket.input.dht.write(str);
        return response(1, MSG_CODE.SUCCESS);
      case C_Streams.MX.messages:
        var str = JSON.stringify(request.body);
        socket.input.messages && socket.input.messages.write(str);
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
