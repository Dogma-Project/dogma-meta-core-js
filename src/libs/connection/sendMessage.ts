import { MESSAGES } from "../../constants";
import Connection from "../connection";

export default function sendMessage(
  this: Connection,
  to: string,
  message: any,
  type: number
) {
  switch (type) {
    case MESSAGES.DIRECT:
      return this.sendMessageToNode(to, message);
    case MESSAGES.USER:
      return this.sendMessageToUser(to, message);
    case MESSAGES.CHAT:
      // edit
      break;
  }
}
