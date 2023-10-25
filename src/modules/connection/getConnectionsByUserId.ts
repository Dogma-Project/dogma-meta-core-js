import * as Types from "../../types";
import Connections from "../connections";
import DogmaSocket from "../socket";

export default function getConnectionsByUserId(
  this: Connections,
  user_id: Types.User.Id
) {
  let connections: DogmaSocket[] = [];
  for (const cid in this.peers) {
    if (this.peers[cid].user_id === user_id) connections.push(this.peers[cid]);
  }
  return connections;
}
