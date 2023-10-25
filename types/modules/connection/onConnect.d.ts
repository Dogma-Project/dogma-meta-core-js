/// <reference types="node" />
import net from "node:net";
import * as Types from "../../types";
import ConnectionClass from "../connections";
export default function onConnect(this: ConnectionClass, socket: net.Socket, peer: Types.Connection.Peer, // check
direction?: Types.Connection.Direction): void;
