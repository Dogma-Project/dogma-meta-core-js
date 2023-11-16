import EventEmitter from "node:events";
import logger from "./logger";
import * as Types from "../types";
import Storage from "./storage";
import DogmaSocket from "./socket";
import StateManager from "./state";
import Connections from "./connections";
import { DHTModel } from "./model";

type DHTParams = {
  connections: Connections;
  state: StateManager;
  storage: Storage;
  model: DHTModel;
};

class DHT extends EventEmitter {
  connectionsBridge: Connections;
  stateBridge: StateManager;
  storageBridge: Storage;
  modelBridge: DHTModel;

  permissions: {
    [key in Types.DHT.Type]: Types.Connection.Group;
  };
  peers: DogmaSocket[];

  /**
   *
   */
  constructor({ storage, state, connections, model }: DHTParams) {
    super();
    this.peers = [];
    this.permissions = [
      Types.Connection.Group.unknown,
      Types.Connection.Group.unknown,
      Types.Connection.Group.unknown,
    ];
    this.connectionsBridge = connections;
    this.stateBridge = state;
    this.storageBridge = storage;
    this.modelBridge = model;
  }

  /**
   *
   * @param {Array} peers array of active connections
   */
  setPeers(peers: DogmaSocket[]) {
    this.peers = peers;
  }

  public setPermission(type: Types.DHT.Type, level: Types.Connection.Group) {
    this.permissions[type] = level;
    logger.log("DHT", "setPermission", "set permission level", type, level); // change to log
  }

  public announce(port: number) {
    const permission = this.permissions[Types.DHT.Type.dhtAnnounce];
    const request: Types.DHT.Abstract = {
      class: Types.Streams.MX.dht,
      body: {
        type: Types.DHT.Request.announce,
        action: Types.DHT.Action.push,
        data: { port },
      },
    };
    this.connectionsBridge.multicast(request, permission);
  }

  public lookup(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    const permission = this.permissions[Types.DHT.Type.dhtLookup];
    const request: Types.DHT.Abstract = {
      class: Types.Streams.MX.dht,
      body: {
        type: Types.DHT.Request.lookup,
        action: Types.DHT.Action.get,
        data: { user_id, node_id },
      },
    };
    this.connectionsBridge.multicast(request, permission);
  }

  public revoke(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    const permission = this.permissions[Types.DHT.Type.dhtAnnounce];
    const request: Types.DHT.Abstract = {
      class: Types.Streams.MX.dht,
      body: {
        type: Types.DHT.Request.revoke,
        action: Types.DHT.Action.push,
        data: { user_id, node_id },
      },
    };
    this.connectionsBridge.multicast(request, permission);
  }

  public async handleRequest(params: Types.DHT.Card, socket: DogmaSocket) {
    // add validation
    try {
      const {
        request: { type, action },
        from,
      } = params;

      if (!type || !action) {
        return logger.warn(
          "DHT",
          "handleRequest",
          "unknown request",
          type,
          action
        );
      }

      switch (params.request.type) {
        case Types.DHT.Request.announce:
          params.request;
          await this._handleAnnounce({
            from,
            request: params.request,
          });
          break;
        case Types.DHT.Request.revoke:
          await this._handleRevoke({
            from,
            request: params.request,
          });
          break;
        case Types.DHT.Request.lookup:
          if (params.request.action === Types.DHT.Action.get) {
            const peers = await this._handleLookup({
              from,
              request: params.request,
            });
            if (peers && Object.keys(peers).length) {
              const card: Types.DHT.LookUp.Answer = {
                action: Types.DHT.Action.set,
                type: Types.DHT.Request.lookup,
                data: peers,
              };
              socket.input.dht && socket.input.dht.write(JSON.stringify(card)); // edit
            }
          } else if (params.request.action === Types.DHT.Action.set) {
            this._handlePeers({
              from,
              request: params.request,
            });
          }
          break;
      }
    } catch (err) {
      logger.error("DHT", "handleRequest", err);
    }
  }

  async _handleAnnounce({
    from,
    request,
  }: Types.DHT.CardQuery<Types.DHT.Announce.Request>) {
    const { node_id, user_id, public_ipv4 } = from;
    const { port } = request.data;
    const full: Types.DHT.Model = { node_id, user_id, public_ipv4, port };
    return this.modelBridge.checkOrInsert(full);
  }

  async _handleLookup({
    from,
    request,
  }: Types.DHT.CardQuery<Types.DHT.LookUp.Request>) {
    request;
    const { user_id, node_id } = request.data;

    let params: {
      user_id: Types.User.Id;
      node_id?: Types.Node.Id;
    } = { user_id };
    if (node_id) params.node_id = node_id;

    try {
      const documents = await this.modelBridge.get(params);
      const result: Types.DHT.LookUp.Answer.Data[] = documents.map((item) => {
        const { user_id, node_id, public_ipv4, port } = item;
        return { user_id, node_id, public_ipv4, port };
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  _handleRevoke({
    from,
    request,
  }: Types.DHT.CardQuery<Types.DHT.Revoke.Request>) {
    logger.debug("DHT", "handleRevoke", arguments);
  }

  _handlePeers({
    from,
    request,
  }: Types.DHT.CardQuery<Types.DHT.LookUp.Answer>) {
    const { data } = request;
    this.emit("peers", data);
  }
}

export default DHT;
