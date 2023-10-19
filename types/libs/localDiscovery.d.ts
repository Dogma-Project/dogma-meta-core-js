/// <reference types="node" />
/// <reference types="node" />
import dgram from "node:dgram";
import EventEmitter from "node:events";
import { Types } from "../types";
declare class LocalDiscovery extends EventEmitter {
    ip: string;
    port: number;
    broadcast: string;
    server: dgram.Socket;
    constructor({ port, ip }: {
        port: number;
        ip: string;
    });
    startServer(): this;
    announce(card: Types.Discovery.Card): this;
}
export default LocalDiscovery;
