import { onConnect, closeConnectionByNodeId, closeConnectionsByUserId, sendRequestToNode, sendRequestToUser, on, peerFromIP, multicast, getConnectionByNodeId, getConnectionsByUserId } from "./connection/index";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import { C_Connection, C_Streams } from "@dogma-project/constants-meta";
/** @module Connections */
declare class Connections {
    protected stateBridge: StateManager;
    protected storageBridge: Storage;
    protected handlers: {
        [key in C_Streams.MX]?: Types.Streams.DataHandler;
    };
    constructor({ state, storage }: {
        state: StateManager;
        storage: Storage;
    });
    protected peers: Types.Connection.SocketArray;
    protected online: Types.Node.Id[];
    protected getConnectionByNodeId: typeof getConnectionByNodeId;
    protected getConnectionsByUserId: typeof getConnectionsByUserId;
    closeConnectionByNodeId: typeof closeConnectionByNodeId;
    closeConnectionsByUserId: typeof closeConnectionsByUserId;
    sendRequestToNode: typeof sendRequestToNode;
    sendRequestToUser: typeof sendRequestToUser;
    onConnect: typeof onConnect;
    peerFromIP: typeof peerFromIP;
    multicast: typeof multicast;
    on: typeof on;
    isNodeOnline: (node_id: Types.Node.Id) => boolean;
    isUserAuthorized(user_id: string): boolean | null;
    allowDiscoveryRequests(direction: C_Connection.Direction): boolean;
    /**
     * @todo implement
     * @returns
     */
    allowFriendshipRequests(): boolean;
}
export default Connections;
