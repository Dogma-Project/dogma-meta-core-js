import logger from "../logger";
import EventEmitter from "../../components/eventEmitter";
import { Types } from "../../types";
import ConnectionClass from "../connection";

export default function online(this: ConnectionClass, node_id: Types.Node.Id) {
  logger.log("connection", "ONLINE", node_id);
  this.online.push(node_id);
  EventEmitter.emit("friends", true); // edit node_id
  EventEmitter.emit("connections", true); // edit connection_id
}
