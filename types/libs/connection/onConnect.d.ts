/// <reference types="node" />
import net from "node:net";
import { Types } from "../../types";
import ConnectionClass from "../connection";
export default function onConnect(this: ConnectionClass, socket: net.Socket, peer: Types.Connection.Peer): void;
