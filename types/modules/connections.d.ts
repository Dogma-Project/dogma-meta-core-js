import { onConnect, closeConnectionByNodeId, closeConnectionsByUserId, sendRequestToNode, sendRequestToUser, peerFromIP, multicast, getConnectionByNodeId, getConnectionsByUserId } from "./connection/index";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
/** @module Connections */
declare class Connections {
    stateBridge: StateManager;
    storageBridge: Storage;
    constructor({ state, storage }: {
        state: StateManager;
        storage: Storage;
    });
    peers: Types.Connection.SocketArray;
    online: Types.Node.Id[];
    encodedStream: null;
    decodedStream: null;
    messageEncoder: null;
    highWaterMark: number;
    sendRequestToNode: typeof sendRequestToNode;
    sendRequestToUser: typeof sendRequestToUser;
    onConnect: typeof onConnect;
    getConnectionByNodeId: typeof getConnectionByNodeId;
    getConnectionsByUserId: typeof getConnectionsByUserId;
    closeConnectionByNodeId: typeof closeConnectionByNodeId;
    closeConnectionsByUserId: typeof closeConnectionsByUserId;
    peerFromIP: typeof peerFromIP;
    multicast: typeof multicast;
}
export default Connections;
