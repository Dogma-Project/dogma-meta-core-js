/// <reference types="node" />
import net from "node:net";
import Connections from "./connections";
import StateManager from "./state";
import Storage from "./storage";
/** @module Server */
export default class Server {
    connectionsBridge: Connections;
    stateBridge: StateManager;
    storageBridge: Storage;
    ss: net.Server | null;
    port: number;
    constructor({ connections, state, storage, }: {
        connections: Connections;
        state: StateManager;
        storage: Storage;
    });
    listen(port: number): void;
    stop(cb: Function): void;
    refresh(port: number): void;
}
