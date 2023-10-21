import { Types } from "../../types";
import Connection from "../connection";

export default function sendMessage(
  this: Connection,
  to: string,
  message: any,
  type: Types.Message.Type
) {
  switch (type) {
    case Types.Message.Type.direct:
      return this.sendMessageToNode(to, message);
    case Types.Message.Type.user:
      return this.sendMessageToUser(to, message);
    case Types.Message.Type.chat:
      // edit
      break;
  }
}
