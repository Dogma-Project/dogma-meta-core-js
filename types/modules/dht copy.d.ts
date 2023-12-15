/// <reference types="node" />
import EventEmitter from "node:events";
import * as Types from "../types";
import Storage from "./storage";
import DogmaSocket from "./socket";
import StateManager from "./state";
import Connections from "./connections";
import { DHTModel } from "./model";
import { C_Connection, C_DHT } from "@dogma-project/constants-meta";
type DHTParams = {
    connections: Connections;
    state: StateManager;
    storage: Storage;
    model: DHTModel;
};
declare class DHT extends EventEmitter {
    connectionsBridge: Connections;
    stateBridge: StateManager;
    storageBridge: Storage;
    modelBridge: DHTModel;
    permissions: {
        [key in C_DHT.Type]: C_Connection.Group;
    };
    peers: DogmaSocket[];
    constructor({ storage, state, connections, model }: DHTParams);
    /**
     *
     * @param {Array} peers array of active connections
     */
    setPeers(peers: DogmaSocket[]): void;
    setPermission(type: C_DHT.Type, level: C_Connection.Group): void;
    announce(port: number): void;
    private handleAnnounce;
    lookup(user_id: Types.User.Id, node_id?: Types.Node.Id): void;
    private handleLookup;
    revoke(user_id: Types.User.Id, node_id?: Types.Node.Id): void;
    private handleRevoke;
    private getPeers;
}
export default DHT;
