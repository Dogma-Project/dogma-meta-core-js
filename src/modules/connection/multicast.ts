import * as Types from "../../types";
import Connections from "../connections";
import logger from "../logger";

export default function multicast(
  this: Connections,
  request: Types.Request,
  destination: Types.Connection.Group
) {
  if (destination === Types.Connection.Group.unknown) return;
  if (destination > Types.Connection.Group.selfNode) return;
  logger.log("Multicast", "Class:", request.class, "Destination:", destination);
  for (const cid in this.peers) {
    const socket = this.peers[cid];
    if (socket.group >= destination) {
      switch (request.class) {
        case Types.Streams.MX.dht:
          socket.input.dht &&
            socket.input.dht.write(JSON.stringify(request.body));
          break;
        default:
          request; // dummy
          break;
      }
    }
  }
}
