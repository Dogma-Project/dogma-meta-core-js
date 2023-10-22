import {
  sendMessageToNode,
  sendRequestToNode,
  onConnect,
  onData,
  accept,
  online,
  offline,
  closeConnectionByNodeId,
  closeConnectionsByUserId,
  sendRequestToUser,
  sendMessageToUser,
  streamToNode,
  sendMessage,
  sendRequest,
  peerFromIP,
} from "./connection/index";
import { Types } from "../types";
import StateManager from "./state";
import Storage from "./storage";

/** @module Connections */

class Connections {
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

  sendMessageToNode = sendMessageToNode;
  sendMessageToUser = sendMessageToUser;
  sendRequestToNode = sendRequestToNode;
  sendRequestToUser = sendRequestToUser;
  streamToNode = streamToNode;

  sendRequest = sendRequest;
  sendMessage = sendMessage;

  onData = onData;
  onConnect = onConnect;

  _online = online;
  _offline = offline;

  closeConnectionByNodeId = closeConnectionByNodeId;
  closeConnectionsByUserId = closeConnectionsByUserId;

  peerFromIP = peerFromIP;
}

/*
dht.setPeers(connection.peers); // edit
*/

export default Connections;
