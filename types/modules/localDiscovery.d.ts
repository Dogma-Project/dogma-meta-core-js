/// <reference types="node" />
/// <reference types="node" />
import dgram from "node:dgram";
import EventEmitter from "node:events";
import * as Types from "../types";
/** @module LocalDiscovery */
declare class LocalDiscovery extends EventEmitter {
    ip: string;
    port: number;
    broadcast: string;
    server?: dgram.Socket;
    ready: boolean;
    constructor({ port, ip }: {
        port: number;
        ip: string;
    });
    startServer(): this;
    stopServer(): void;
    announce(card: Types.Discovery.Card): void | this;
}
export default LocalDiscovery;
