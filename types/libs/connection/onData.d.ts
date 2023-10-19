/// <reference types="node" />
import ConnectionClass from "../connection";
import { Types } from "../../types";
export default function onData(this: ConnectionClass, socket: Types.Connection.Socket, data: Buffer, id: number): void;
