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
} from "./connection/index";
import * as Types from "../types";
import StateManager from "./state";
import Storage from "./storage";
import {
  C_Connection,
  C_Event,
  C_Streams,
} from "@dogma-project/constants-meta";
import { workerData } from "node:worker_threads";

/** @module Connections */

class Connections {
  protected stateBridge: StateManager;
  protected storageBridge: Storage;
  protected handlers: {
    [key in C_Streams.MX]?: Types.Streams.DataHandler;
  } = {};

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
  public on = on;
  public isNodeOnline = (node_id: Types.Node.Id) => {
    return this.online.indexOf(node_id) > -1;
  };
  public isUserAuthorized(user_id: string) {
    const users = this.stateBridge.get<Types.User.Model[] | undefined>(
      C_Event.Type.users
    );
    if (!users) return null;
    const inFriendsList = users.find((user) => user.user_id === user_id);
    if (!inFriendsList) return false;
    return !inFriendsList.requested;
  }

  public allowDiscoveryRequests(direction: C_Connection.Direction) {
    if (direction === C_Connection.Direction.incoming) {
      if (workerData.discovery) return true;
      const dhtBootstrap = this.stateBridge.get(
        C_Event.Type.configDhtBootstrap
      );
      if (dhtBootstrap && dhtBootstrap === C_Connection.Group.all) return true;
    } else {
      if (workerData.discovery) return false;
      const dhtAnnounce = this.stateBridge.get(C_Event.Type.configDhtAnnounce);
      if (dhtAnnounce && dhtAnnounce === C_Connection.Group.all) return true;
      const dhtLookup = this.stateBridge.get(C_Event.Type.configDhtLookup);
      if (dhtLookup && dhtLookup === C_Connection.Group.all) return true;
    }
    return false;
  }

  /**
   * @todo implement
   * @returns
   */
  public allowFriendshipRequests() {
    return true;
  }
}

export default Connections;
