import Connection from "../connection";
import { Types } from "../../types";

export default function sendRequest(
  this: Connection,
  to: string,
  request: any,
  type: Types.Message.Type
) {
  switch (type) {
    case Types.Message.Type.direct:
      return this.sendRequestToNode(to, request);
    case Types.Message.Type.user:
      return this.sendRequestToUser(to, request);
    case Types.Message.Type.chat:
      // edit
      break;
  }
}
