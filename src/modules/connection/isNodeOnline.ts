import ConnectionClass from "../connections";
import * as Types from "../../types";

export default function isNodeOnline(
  this: ConnectionClass,
  node_id: Types.Node.Id
) {
  return this.online.indexOf(node_id) > -1;
}
