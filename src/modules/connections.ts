import {
  onConnect,
  closeConnectionByNodeId,
  closeConnectionsByUserId,
  sendRequestToNode,
  sendRequestToUser,
  on,
  peerFromIP,
  multicast,
  getConnectionByNodeId,
  getConnectionsByUserId,
  isNodeOnline,
  isUserAuthorized,
  allowDiscoveryRequests,
  allowFriendshipRequests,
} from "./connection/index";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import { C_Streams } from "../types/constants";

/** @module Connections */

class Connections {
  protected stateBridge: StateManager;
  protected storageBridge: Storage;
  protected modelsBridge: Types.Model.All;

  protected handlers: {
    [key in C_Streams.MX]?: Types.Streams.DataHandler;
  } = {};

  constructor({
    state,
    storage,
    models,
  }: {
    state: StateManager;
    storage: Storage;
    models: Types.Model.All;
  }) {
    this.stateBridge = state;
    this.storageBridge = storage;
    this.modelsBridge = models;
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
  public on = on;
  public isNodeOnline = isNodeOnline;
  public isUserAuthorized = isUserAuthorized;
  public allowDiscoveryRequests = allowDiscoveryRequests;
  public allowFriendshipRequests = allowFriendshipRequests;
}

export default Connections;
