import EventEmitter from "node:events";
import logger from "./logger";
import { dht } from "../components/nedb";
import { DHTPERM } from "../constants";
import { store } from "./store";
import { Types } from "../types";
import { Document } from "@seald-io/nedb";

/** @module DHT */

class DHT extends EventEmitter {
  permissions: {
    dhtBootstrap: number;
    dhtAnnounce: number;
    dhtLookup: number;
  };
  peers: Types.Connection.Socket[];

  /**
   *
   */
  constructor() {
    super();
    this.peers = [];
    this.permissions = {
      dhtBootstrap: 0,
      dhtAnnounce: 0,
      dhtLookup: 0,
    };
  }

  /**
   *
   * @param {Array} peers array of active connections
   */
  setPeers(peers: Types.Connection.Socket[]) {
    this.peers = peers;
  }

  /**
   *
   * @param type dhtAnnounce, dhtBootstrap, dhtLookup
   * @param level 0, 1, 2, 3
   */
  setPermission(type: Types.DHT.Type, level: 0 | 1 | 2 | 3) {
    if (!this.permissions.hasOwnProperty(type)) {
      return logger.warn(
        "DHT",
        "setPermission",
        "unkonown permission type",
        type
      );
    }
    this.permissions[type] = level;
    logger.log("DHT", "setPermission", "set permission level", type, level); // change to log
  }

  /**
   * Sends announce to all online connections
   * @param {Number} port
   */
  announce(port: number) {
    if (!this.permissions.dhtAnnounce) return;
    this._dhtMulticast("announce", { port });
  }

  /**
   * Sends DHT lookup request to all online connections
   * @param user_id user's hash
   * @param node_id [optional] node hash
   */
  lookup(user_id: Types.User.Id, node_id?: Types.Node.Id) {
    if (!this.permissions.dhtLookup) return;
    this._dhtMulticast("lookup", { user_id, node_id });
  }

  revoke() {
    if (!this.permissions.dhtAnnounce) return;
    // multicast
  }

  /**
   * Requests router
   * @param {Object} params
   * @param {Object} params.request
   * @param {String} params.request.type announce,revoke,lookup
   * @param {String} params.request.action get, set
   * @param {Number} params.request.port node's public port
   * @param {String} params.request.user_id optional (only for lookup)
   * @param {String} params.request.node_id optional (only for lookup)
   * @param {Object} params.from determined by own node
   * @param {String} params.from.user_id user hash
   * @param {String} params.from.node_id node hash
   * @param {String} params.from.public_ipv4 host
   * @param {Object} socket [optional] for a feedback
   */
  async handleRequest(params: Types.DHT.Card, socket: Types.Connection.Socket) {
    // add validation
    try {
      const {
        request: { type, action },
        request,
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
        case "announce":
          params.request;
          await this._handleAnnounce({
            from,
            request: params.request,
          });
          break;
        case "revoke":
          await this._handleRevoke({
            from,
            request: params.request,
          });
          break;
        case "lookup":
          if (params.request.action === "get") {
            const peers = await this._handleLookup({
              from,
              request: params.request,
            });
            if (peers && Object.keys(peers).length) {
              socket.multiplex.dht.write(
                JSON.stringify({
                  action: "set",
                  type,
                  data: peers,
                })
              );
            }
          } else if (params.request.action === "set") {
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

  /**
   * Controller
   * @private
   * @param {Object} params
   * @param {Object} params.from
   * @param {Object} params.request
   * @param {String} params.request.user_id
   * @param {String} params.request.node_id optional
   * @returns {Promise}
   */
  _handleLookup({
    from,
    request,
  }: {
    from: Types.DHT.FromData;
    request: Types.DHT.RequestData.Lookup;
  }) {
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

  /**
   * Controller
   * @private
   * @param {Object} params
   * @param {Object} params.from
   * @param {Object} params.request
   */
  _handleRevoke({
    from,
    request,
  }: {
    from: Types.DHT.FromData;
    request: Types.DHT.RequestData.Revoke;
  }) {
    logger.debug("DHT", "handleRevoke", arguments);
  }

  /**
   * Controller
   * @private
   * @param {Object} params
   * @param {Object} params.from
   * @param {Object} params.request
   * @param {String} params.request.type
   * @param {String} params.request.data
   * @returns {Promise}
   */
  _handlePeers({
    from,
    request,
  }: {
    from: Types.DHT.FromData;
    request: Types.DHT.RequestData.LookupAnswer;
  }) {
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

  /**
   * Send request to all nodes
   * @private
   * @param {String} type announce, lookup, revoke
   * @param {Object} data
   * @param {Number} data.port [optional] for announce
   * @param {String} data.user_id [optional] for lookup
   * @param {String} data.node_id [optional] for lookup. only when looking for specific node
   */
  _dhtMulticast(type: Types.DHT.Request, data: Types.DHT.RequestData.Outgoing) {
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
