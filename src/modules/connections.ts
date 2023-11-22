import {
  onConnect,
  closeConnectionByNodeId,
  closeConnectionsByUserId,
  sendRequestToNode,
  sendRequestToUser,
  // streamToNode,
  peerFromIP,
  multicast,
  getConnectionByNodeId,
  getConnectionsByUserId,
} from "./connection/index";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";

/** @module Connections */

class Connections {
  protected stateBridge: StateManager;
  protected storageBridge: Storage;

  constructor({ state, storage }: { state: StateManager; storage: Storage }) {
    this.stateBridge = state;
    this.storageBridge = storage;
  }

  protected peers: Types.Connection.SocketArray = {};
  protected online: Types.Node.Id[] = [];

  protected getConnectionByNodeId = getConnectionByNodeId;
  protected getConnectionsByUserId = getConnectionsByUserId;
  closeConnectionByNodeId = closeConnectionByNodeId;
  closeConnectionsByUserId = closeConnectionsByUserId;

  // streamToNode = streamToNode;
  public sendRequestToNode = sendRequestToNode;
  public sendRequestToUser = sendRequestToUser;
  public onConnect = onConnect;
  public peerFromIP = peerFromIP;
  public multicast = multicast;
  public isNodeOnline = (node_id: Types.Node.Id) => {
    return this.online.indexOf(node_id) > -1;
  };
}

/*
dht.setPeers(connection.peers); // edit
*/

export default Connections;
