import * as Types from "../../types";
import ConnectionClass from "../connections";

/**
 * @todo handle ipv6
 * @param this
 * @param ip
 * @returns
 */
export default function peerFromIP(
  this: ConnectionClass,
  ip: Types.Connection.IPv4 | Types.Connection.IPv6
) {
  const [host, port] = ip.split(":");
  const peer: Types.Connection.Peer = {
    host,
    port: Number(port),
    address: ip,
    public: !(host.includes("192.168.") || host.includes("127.0.")),
  };
  return peer;
}
