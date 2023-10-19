/// <reference types="node" />
import net from "node:net";
import Connection from "./connection";
/** @module Server */
export default class Server {
    connectionBridge: Connection;
    ss: net.Server | null;
    port: number;
    constructor(connection: Connection);
    listen(port: number): void;
    stop(cb: Function): void;
    refresh(port: number): void;
    /**
     * Allows unauthorized server connections
     * @returns {Boolean}
     * @todo check how args.discovery allows ALL permission
     */
    permitUnauthorized(): boolean;
}
