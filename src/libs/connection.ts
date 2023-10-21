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
import StateManager from "./state";
import Storage from "./storage";

/** @module Connection */

class Connection {
  stateBridge: StateManager;
  storageBridge: Storage;

  constructor({ state, storage }: { state: StateManager; storage: Storage }) {
    this.stateBridge = state;
    this.storageBridge = storage;
  }

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
