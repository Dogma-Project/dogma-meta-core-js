import logger from "../../libs/logger";
import EventEmitter from "../../components/eventEmitter";
import { Types } from "../../types";
import ConnectionClass from "../connection";

export default function offline(this: ConnectionClass, node_id: Types.Node.Id) {
  const index = this.online.indexOf(node_id);
  if (index !== -1) {
    logger.log("connection", "OFFLINE", node_id);
    this.online.splice(index, 1);
    EventEmitter.emit("friends", true); // edit node_id
    EventEmitter.emit("connections", true); // edit connection_id
  }
}
