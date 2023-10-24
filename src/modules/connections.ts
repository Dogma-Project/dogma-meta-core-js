import {
  onConnect,
  closeConnectionByNodeId,
  closeConnectionsByUserId,
  sendRequestToNode,
  sendRequestToUser,
  streamToNode,
  peerFromIP,
  multicast,
  getConnectionByNodeId,
  getConnectionsByUserId,
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

  sendRequestToNode = sendRequestToNode;
  sendRequestToUser = sendRequestToUser;
  streamToNode = streamToNode;

  onConnect = onConnect;

  getConnectionByNodeId = getConnectionByNodeId;
  getConnectionsByUserId = getConnectionsByUserId;
  closeConnectionByNodeId = closeConnectionByNodeId;
  closeConnectionsByUserId = closeConnectionsByUserId;

  peerFromIP = peerFromIP;
  multicast = multicast;
}

/*
dht.setPeers(connection.peers); // edit
*/

export default Connections;
