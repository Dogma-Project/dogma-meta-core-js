import ConnectionClass from "./connection";
import { Types } from "../types";
/** @module Client */
export default class Client {
    connectionBridge: ConnectionClass;
    constructor(connection: ConnectionClass);
    connect(peer: Types.Connection.Peer): void;
    test(peer: Types.Connection.Peer, cb: (result: boolean) => void): void;
    permitUnauthorized(): boolean;
    tryPeer(peer: Types.Connection.Peer, from: {
        user_id: Types.User.Id;
        node_id: Types.Node.Id;
    }): void;
    getOwnNodes(): Promise<any>;
    /**
     * DHT Lookup all friends
     */
    searchFriends(): void;
    /**
     * Try to connect all nodes
     */
    connectFriends(): void;
    dhtLookup(user_id: Types.User.Id): void;
}
