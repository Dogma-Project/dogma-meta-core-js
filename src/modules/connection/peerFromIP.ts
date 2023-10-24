import { Types } from "../../types";
import ConnectionClass from "../connections";

export default function peerFromIP(
  this: ConnectionClass,
  ip: Types.Connection.IPv4 | Types.Connection.IPv6
) {
  const [host, port] = ip.split(":");
  const peer: Types.Connection.Peer = {
    host,
    port: Number(port),
    address: ip,
  };
  return peer;
}
