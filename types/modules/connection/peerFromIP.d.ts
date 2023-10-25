import * as Types from "../../types";
import ConnectionClass from "../connections";
export default function peerFromIP(this: ConnectionClass, ip: Types.Connection.IPv4 | Types.Connection.IPv6): Types.Connection.Peer;
