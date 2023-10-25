import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import Connections from "./connections";
/** @module Client */
export default class Client {
    connectionsBridge: Connections;
    stateBridge: StateManager;
    storageBridge: Storage;
    constructor({ connections, state, storage, }: {
        connections: Connections;
        state: StateManager;
        storage: Storage;
    });
    private _connect;
    /**
     *
     * @todo edit
     */
    tryPeer(peer: Types.Connection.Peer, node: {
        user_id: Types.User.Id;
        node_id: Types.Node.Id;
    }): void;
    test(peer: Types.Connection.Peer, cb: (result: boolean) => void): void;
    /**
     * DHT Lookup all friends
     */
    searchFriends(): void;
    /**
     * @todo move to connections
     */
    connectFriends(): void;
    /**
     *
     * @todo move from here
     */
    dhtLookup(user_id: Types.User.Id): void;
}
