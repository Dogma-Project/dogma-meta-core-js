import EventEmitter from "node:events";
import logger from "./logger";
import { dht } from "../components/nedb";
import { Types } from "../types";
import { Document } from "@seald-io/nedb";
import Storage from "./storage";
import DogmaSocket from "./socket";

/** @module DHT */

type DHTParams = {
  storage: Storage;
};

class DHT extends EventEmitter {
  permissions: {
    [Types.DHT.Type.dhtBootstrap]: Types.Connection.Group;
    [Types.DHT.Type.dhtAnnounce]: Types.Connection.Group;
    [Types.DHT.Type.dhtLookup]: Types.Connection.Group;
  };
  peers: DogmaSocket[];

  /**
   *
   */
  constructor({ storage }: DHTParams) {
    super();
    this.peers = [];
    this.permissions = {
      [Types.DHT.Type.dhtBootstrap]: Types.Connection.Group.unknown,
      [Types.DHT.Type.dhtAnnounce]: Types.Connection.Group.unknown,
      [Types.DHT.Type.dhtLookup]: Types.Connection.Group.unknown,
    };
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
    this._dhtMulticast(Types.DHT.Request.announce, { port });
  }

  public lookup(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    this._dhtMulticast(Types.DHT.Request.lookup, { user_id, node_id });
  }

  public revoke(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    this._dhtMulticast(Types.DHT.Request.revoke, { user_id, node_id });
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
              socket.input.dht.write(JSON.stringify());
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

  /**
   * Controller
   * @private
   * @param {Object} params
   * @param {Object} params.from
   * @param {Object} params.request
   * @returns {Promise}
   */
  _handleAnnounce({
    from,
    request,
  }: {
    from: Types.DHT.FromData;
    request: Types.DHT.RequestData.Announce;
  }) {
    const { node_id, user_id, public_ipv4 } = from;
    const { port } = request;

    const conditions = { node_id, user_id };
    const full = { node_id, user_id, public_ipv4, port };

    if (!user_id || !node_id || !port) {
      logger.warn("DHT", "skip non-standard announce");
      return Promise.reject("non-standard announce");
    }

    // if (public_ipv4.indexOf("192.168.") > -1) return Promise.reject();
    return new Promise((resolve, reject) => {
      logger.info("DHT", "handled announce", `${public_ipv4}:${port}`);
      dht.find(full, (err: any, result: Document<Record<string, any>>[]) => {
        // reject if already present
        if (err)
          reject({
            error: "find-announce",
            data: err,
          });
        if (result.length)
          return reject({
            error: null,
            data: "already present",
          });
        dht.update(conditions, full, { upsert: true }, (err, result) => {
          // update or insert new value
          if (err)
            reject({
              error: "find-announce",
              data: err,
            });
          resolve({
            type: "announce",
            result: 1,
          });
        });
      });
    });
  }

  _handleLookup({ from, request }: Types.DHT.CardQuery) {
    const { public_ipv4 } = from;
    const { user_id, node_id } = request;

    return new Promise((resolve, reject) => {
      let params: {
        user_id: Types.User.Id;
        node_id?: Types.Node.Id;
      } = { user_id };
      if (node_id) params.node_id = node_id;
      dht.find(
        params,
        (err: any, documents: Document<Record<string, any>>[]) => {
          if (err) return reject(err);
          const result: Types.DHT.RequestData.LookupAnswerData[] =
            documents.map((item) => {
              const { user_id, node_id, public_ipv4, port } = item;
              return { user_id, node_id, public_ipv4, port };
            });
          resolve(result);
        }
      );
    });
  }

  _handleRevoke({ from, request }: Types.DHT.CardQuery) {
    logger.debug("DHT", "handleRevoke", arguments);
  }

  _handlePeers({ from, request }: Types.DHT.CardQuery) {
    const { data } = request;
    this.emit("peers", data);
  }

  /**
   * Check access level to DHT requests. Handled level can't be 0
   * @param {String} type
   * @param {String} user_id
   * @returns {Boolean}
   * @private
   */
  _canUse(type: Types.DHT.Request, user_id: Types.User.Id) {
    // check
    let permission = -1;
    switch (type) {
      case "announce":
      case "revoke":
        permission = this.permissions.dhtAnnounce;
        break;
      case "lookup":
        permission = this.permissions.dhtLookup;
        break;
    }
    if (permission === DHTPERM.ALL) return true;

    const inFriends = !!store.users.find((user) => user.user_id === user_id);
    const own = store.user.id === user_id;

    if (permission >= DHTPERM.ONLY_FRIENDS) {
      return inFriends || own;
    }
    if (permission >= DHTPERM.ONLY_OWN) {
      return own;
    }
  }

  _dhtMulticast(
    type: Types.DHT.Request,
    data:
      | Types.DHT.LookUp.Request.Data
      | Types.DHT.Announce.Request.Data
      | Types.DHT.Revoke.Request.Data
  ) {
    // add validation
    try {
      for (const cid in this.peers) {
        const socket = this.peers[cid];

        if (!socket || !socket.dogma) {
          /**
           * @todo delete closed sockets
           */
          logger.error(
            "DHT",
            "_dhtMulticast",
            "unknown socket",
            cid,
            socket.dogma
          );
          continue;
        }

        if (!this._canUse(type, socket.dogma.user_id)) continue;
        socket.multiplex.dht.write(
          JSON.stringify({
            action: "get",
            type,
            ...data,
          })
        );
      }
    } catch (err) {
      logger.error("dht.js", "dhtMulticast", err);
    }
  }
}

export default DHT;
