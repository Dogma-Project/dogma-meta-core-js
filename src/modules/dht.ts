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
    /**
     * @todo add verification
     */
    this.connectionsBridge.on(Types.Streams.MX.dht, (data, socket) => {
      // add verification
      try {
        const str = data.toString();
        logger.debug("DHT", "DATA", str);
        const parsed = JSON.parse(str) as Types.DHT.Requests;
        switch (parsed.type) {
          case Types.DHT.Request.announce:
            this.handleAnnounce(parsed, socket);
            break;
          case Types.DHT.Request.lookup:
            this.handleLookup(parsed, socket);
            break;
          case Types.DHT.Request.revoke:
            this.handleRevoke(parsed, socket);
            break;
          default:
            logger.warn("DHT", "unknown DHT request type");
            break;
        }
      } catch (err) {
        logger.error("DHT DATA", err);
      }
    });
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
    logger.log("DHT", "setPermission", "set permission level", type, level);
  }

  public announce(port: number) {
    logger.log("DHT", "Announce port", port);
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

  private handleAnnounce(
    request: Types.DHT.Announce.Request,
    socket: DogmaSocket
  ) {
    // only push
    if (request.action === Types.DHT.Action.push) {
      const { node_id, user_id, peer } = socket;
      logger.log("DHT", "Handle announce from", user_id);
      if (!peer.public) return logger.debug("DHT", "skip local", peer.address);
      const { port } = request.data;
      if (user_id && node_id && port) {
        const full: Types.DHT.Model = {
          user_id,
          node_id,
          public_ipv4: peer.address,
          port,
        };
        this.modelBridge.checkOrInsert(full);
      }
    } else {
      logger.warn("DHT", "unk action");
    }
  }

  public lookup(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    logger.log("DHT", "Request loookup", user_id);
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

  private async handleLookup(
    request: Types.DHT.LookUp.Common,
    socket: DogmaSocket
  ) {
    if (request.action === Types.DHT.Action.get) {
      const { user_id, node_id } = request.data;
      logger.log("DHT", "Handle lookup from", user_id);
      const peers = await this.getPeers(user_id, node_id);
      if (peers.length) {
        const card: Types.DHT.LookUp.Answer = {
          action: Types.DHT.Action.set,
          type: Types.DHT.Request.lookup,
          data: peers,
        };
        socket.input.dht && socket.input.dht.write(JSON.stringify(card)); // edit
      }
    } else if (request.action === Types.DHT.Action.set) {
      const { data } = request;
      this.emit("peers", data);
    } else {
    }
  }

  public revoke(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    logger.log("DHT", "Request revoke", user_id);
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

  private handleRevoke(request: Types.DHT.Revoke.Request, socket: DogmaSocket) {
    // only push
    if (request.action === Types.DHT.Action.push) {
      logger.debug("DHT", "handleRevoke", arguments);
    } else {
      logger.warn("DHT", "unk action");
    }
  }

  private async getPeers(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    try {
      const documents = await this.modelBridge.get({ user_id, node_id });
      const result: Types.DHT.LookUp.Answer.Data[] = documents.map((item) => {
        const { user_id, node_id, public_ipv4, port } = item;
        return { user_id, node_id, public_ipv4, port };
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default DHT;
