import { sendMessageToNode, sendRequestToNode, onConnect, onData, onClose, accept, online, offline, closeConnectionByNodeId, closeConnectionsByUserId, sendRequestToUser, sendMessageToUser, streamToNode, sendMessage, sendRequest } from "./connection/index";
import { Types } from "../types";
/** @module Connection */
declare class Connection {
    peers: Types.Connection.SocketArray;
    online: Types.Node.Id[];
    encodedStream: null;
    decodedStream: null;
    messageEncoder: null;
    highWaterMark: number;
    accept: typeof accept;
    reject: (socket: Types.Connection.Socket, ...message: any) => void;
    sendMessageToNode: typeof sendMessageToNode;
    sendMessageToUser: typeof sendMessageToUser;
    sendRequestToNode: typeof sendRequestToNode;
    sendRequestToUser: typeof sendRequestToUser;
    streamToNode: typeof streamToNode;
    sendRequest: typeof sendRequest;
    sendMessage: typeof sendMessage;
    onData: typeof onData;
    onConnect: typeof onConnect;
    onClose: typeof onClose;
    _online: typeof online;
    _offline: typeof offline;
    closeConnectionByNodeId: typeof closeConnectionByNodeId;
    closeConnectionsByUserId: typeof closeConnectionsByUserId;
}
export default Connection;
