import { Types } from "../../types";
import Connections from "../connections";
import DogmaSocket from "../socket";

export default function getConnectionByNodeId(
  this: Connections,
  node_id: Types.Node.Id
) {
  let connection: DogmaSocket | null = null;
  for (const cid in this.peers) {
    if (this.peers[cid].node_id === node_id) connection = this.peers[cid];
  }
  return connection;
}
