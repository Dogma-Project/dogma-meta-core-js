/// <reference types="node" />
import EventEmitter from "node:events";
import * as Types from "../types";
import Storage from "./storage";
import StateManager from "./state";
import Connections from "./connections";
import Model from "./models/_model";
type SyncParams = {
    connections: Connections;
    state: StateManager;
    storage: Storage;
    models: Model[];
};
declare class Sync extends EventEmitter {
    connectionsBridge: Connections;
    stateBridge: StateManager;
    storageBridge: Storage;
    private models;
    constructor({ storage, state, connections, models }: SyncParams);
    /**
     *
     * @param model
     * @param from Timestamp in milliseconds
     * @returns
     */
    private getModelSync;
    /**
     * Handle all
     * @todo check permissions !!! only for own nodes
     * @todo handle timeshift
     * @param request
     * @param socket
     */
    private handle;
    /**
     * Response to sync request
     * @param request
     * @param socket
     */
    private response;
    /**
     * Send sync request
     */
    request(request: Types.Sync.Request, node_id: Types.Node.Id): void;
    /**
     * Send some sync data to all own nodes
     */
    multicast(request: Types.Sync.Notify): void;
}
export default Sync;
