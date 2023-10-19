import {
  sendMessageToNode,
  sendRequestToNode,
  onConnect,
  onData,
  onClose,
  accept,
  reject,
  online,
  offline,
  closeConnectionByNodeId,
  closeConnectionsByUserId,
  sendRequestToUser,
  sendMessageToUser,
  streamToNode,
  sendMessage,
  sendRequest,
} from "./connection/index";
import { Types } from "../types";

/** @module Connection */

class Connection {
  peers: Types.Connection.SocketArray = {};
  online: Types.Node.Id[] = [];

  encodedStream: null = null;
  decodedStream: null = null;
  messageEncoder: null = null;
  highWaterMark: number = 200000;

  accept = accept;
  reject = reject;

  sendMessageToNode = sendMessageToNode;
  sendMessageToUser = sendMessageToUser;
  sendRequestToNode = sendRequestToNode;
  sendRequestToUser = sendRequestToUser;
  streamToNode = streamToNode;

  sendRequest = sendRequest;
  sendMessage = sendMessage;

  onData = onData;
  onConnect = onConnect;
  onClose = onClose;

  _online = online;
  _offline = offline;

  closeConnectionByNodeId = closeConnectionByNodeId;
  closeConnectionsByUserId = closeConnectionsByUserId;
}

/*
dht.setPeers(connection.peers); // edit
*/

export default Connection;
