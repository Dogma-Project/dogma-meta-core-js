import { MESSAGES } from "../../constants";
import Connection from "../connection";

export default function sendRequest(
  this: Connection,
  to: string,
  request: any,
  type: number
) {
  switch (type) {
    case MESSAGES.DIRECT:
      return this.sendRequestToNode(to, request);
    case MESSAGES.USER:
      return this.sendRequestToUser(to, request);
    case MESSAGES.CHAT:
      // edit
      break;
  }
}
