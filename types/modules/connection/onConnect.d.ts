/// <reference types="node" />
import net from "node:net";
import * as Types from "../../types";
import ConnectionClass from "../connections";
import { C_Connection } from "@dogma-project/constants-meta";
export default function onConnect(this: ConnectionClass, socket: net.Socket, peer: Types.Connection.Peer, // check
direction?: C_Connection.Direction): void;
