import { onConnect, closeConnectionByNodeId, closeConnectionsByUserId, sendRequestToNode, sendRequestToUser, on, peerFromIP, multicast, getConnectionByNodeId, getConnectionsByUserId, isNodeOnline, isUserAuthorized, allowDiscoveryRequests, allowFriendshipRequests } from "./connection/index";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import { C_Streams } from "@dogma-project/constants-meta";
/** @module Connections */
declare class Connections {
    protected stateBridge: StateManager;
    protected storageBridge: Storage;
    protected modelsBridge: Types.Model.All;
    protected handlers: {
        [key in C_Streams.MX]?: Types.Streams.DataHandler;
    };
    constructor({ state, storage, models, }: {
        state: StateManager;
        storage: Storage;
        models: Types.Model.All;
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
    isNodeOnline: typeof isNodeOnline;
    isUserAuthorized: typeof isUserAuthorized;
    allowDiscoveryRequests: typeof allowDiscoveryRequests;
    allowFriendshipRequests: typeof allowFriendshipRequests;
}
export default Connections;
