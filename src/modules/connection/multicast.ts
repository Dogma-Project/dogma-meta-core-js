import * as Types from "../../types";
import Connections from "../connections";

export default function multicast(
  this: Connections,
  request: Types.Request,
  destination: Types.Connection.Group
) {
  if (destination === Types.Connection.Group.unknown) return;
  if (destination > Types.Connection.Group.selfNode) return;
  for (const cid in this.peers) {
    if (this.peers[cid].group >= destination) {
      switch (request.class) {
        case Types.Streams.MX.dht:
          this.peers[cid].input.dht.write(JSON.stringify(request.body));
          break;
        default:
          request; // dummy
          break;
      }
    }
  }
}
