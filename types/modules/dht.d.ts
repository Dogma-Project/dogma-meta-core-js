/// <reference types="node" />
import EventEmitter from "node:events";
import * as Types from "../types";
import Storage from "./storage";
import DogmaSocket from "./socket";
import StateManager from "./state";
import Connections from "./connections";
import { DHTModel } from "./model";
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
        [key in Types.DHT.Type]: Types.Connection.Group;
    };
    peers: DogmaSocket[];
    /**
     *
     */
    constructor({ storage, state, connections, model }: DHTParams);
    /**
     *
     * @param {Array} peers array of active connections
     */
    setPeers(peers: DogmaSocket[]): void;
    setPermission(type: Types.DHT.Type, level: Types.Connection.Group): void;
    announce(port: number): void;
    lookup(user_id: Types.User.Id, node_id?: Types.Node.Id): void;
    revoke(user_id: Types.User.Id, node_id?: Types.Node.Id): void;
    handleRequest(params: Types.DHT.Card, socket: DogmaSocket): Promise<void>;
    _handleAnnounce({ from, request, }: Types.DHT.CardQuery<Types.DHT.Announce.Request>): Promise<Types.DHT.Response>;
    _handleLookup({ from, request, }: Types.DHT.CardQuery<Types.DHT.LookUp.Request>): Promise<Types.DHT.LookUp.Answer.Data[]>;
    _handleRevoke({ from, request, }: Types.DHT.CardQuery<Types.DHT.Revoke.Request>): void;
    _handlePeers({ from, request, }: Types.DHT.CardQuery<Types.DHT.LookUp.Answer>): void;
}
export default DHT;
