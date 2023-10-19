/// <reference types="node" />
import ConnectionClass from "../connection";
import net from "node:net";
import { Types } from "../../types";
export default function onClose(this: ConnectionClass, socket: net.Socket | Types.Connection.Socket): Promise<void>;
