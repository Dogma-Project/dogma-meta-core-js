"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const EventEmitter = require("events");
const logger = require("../logger");
const { dht } = require("../modules/nedb");
const { DHTPERM } = require("../modules/constants");
const { store } = require("../modules/store");
/** @module DHT */
class DHT extends EventEmitter {
    /**
     *
     */
    constructor() {
        super();
        this.peers = [];
        this.permissions = {
            dhtBootstrap: 0,
            dhtAnnounce: 0,
            dhtLookup: 0
        };
    }
    /**
     *
     * @param {Array} peers array of active connections
     */
    setPeers(peers) {
        this.peers = peers;
    }
    /**
     *
     * @param {String} type dhtAnnounce, dhtBootstrap, dhtLookup
     * @param {Number} level 0, 1, 2, 3
     */
    setPermission(type, level) {
        if (!Object.values(DHTPERM).includes(level)) {
            return logger.warn("DHT", "setPermission", "unkonown permission level", level);
        }
        if (!this.permissions.hasOwnProperty(type)) {
            return logger.warn("DHT", "setPermission", "unkonown permission type", type);
        }
        this.permissions[type] = level;
        logger.log("DHT", "setPermission", "set permission level", type, level); // change to log
    }
    /**
     * Sends announce to all online connections
     * @param {Number} port
     */
    announce(port) {
        if (!this.permissions.dhtAnnounce)
            return;
        this._dhtMulticast("announce", { port });
    }
    /**
     * Sends DHT lookup request to all online connections
     * @param {String} user_id user's hash
     * @param {String} node_id [optional] node hash
     */
    lookup(user_id, node_id = null) {
        if (!this.permissions.dhtLookup)
            return;
        this._dhtMulticast("lookup", { user_id, node_id });
    }
    revoke() {
        if (!this.permissions.dhtAnnounce)
            return;
        // multicast
    }
    /**
     * Requests router
     * @param {Object} params
     * @param {Object} params.request
     * @param {String} params.request.type announce,revoke,lookup
     * @param {String} params.request.action get, set
     * @param {Number} params.request.port node's public port
     * @param {String} params.request.user_id optional (only foor lookup)
     * @param {String} params.request.node_id optional (only foor lookup)
     * @param {Object} params.from determined by own node
     * @param {String} params.from.user_id user hash
     * @param {String} params.from.node_id node hash
     * @param {String} params.from.public_ipv4 host
     * @param {Object} socket [optional] for a feedback
     */
    handleRequest(params, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { request: { type, action }, from: { public_ipv4 } } = params;
                if (!type || !action) {
                    return logger.warn("DHT", "handleRequest", "unknown request", type, action);
                }
                switch (type) {
                    case "announce":
                        yield this._handleAnnounce(params);
                        break;
                    case "revoke":
                        yield this._handleRevoke(params);
                        break;
                    case "lookup":
                        if (action === "get") {
                            const peers = yield this._handleLookup(params);
                            if (peers && peers.length) {
                                socket.multiplex.dht.write(JSON.stringify({
                                    action: "set",
                                    type,
                                    data: peers
                                }));
                            }
                        }
                        else if (action === "set") {
                            this._handlePeers(params);
                        }
                        break;
                }
            }
            catch (err) {
                logger.error("DHT", "handleRequest", err);
            }
        });
    }
    /**
     * Controller
     * @private
     * @param {Object} params
     * @param {Object} params.from
     * @param {Object} params.request
     * @returns {Promise}
     */
    _handleAnnounce({ from, request }) {
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
            dht.find(full, (err, result) => {
                if (err)
                    reject({
                        error: "find-announce",
                        data: err
                    });
                if (result.length)
                    return reject({
                        error: null,
                        data: "already present"
                    });
                dht.update(conditions, full, { upsert: true }, (err, result) => {
                    if (err)
                        reject({
                            error: "find-announce",
                            data: err
                        });
                    resolve({
                        type: "announce",
                        result: 1
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
    _handleLookup({ from, request }) {
        const { public_ipv4 } = from;
        const { user_id, node_id } = request;
        return new Promise((resolve, reject) => {
            let params = { user_id };
            if (node_id)
                params.node_id = node_id;
            dht.find(params, (err, result) => {
                if (err)
                    return reject(err);
                result = result.map((item) => {
                    const { user_id, node_id, public_ipv4, port } = item;
                    return { user_id, node_id, public_ipv4, port };
                });
                resolve(result);
            });
        });
    }
    /**
     * Controller
     * @private
     * @param {Object} params
     * @param {Object} params.from
     * @param {Object} params.request
     */
    _handleRevoke({ from, request }) {
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
    _handlePeers({ from, request }) {
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
    _canUse(type, user_id) {
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
        if (permission === DHTPERM.ALL)
            return true;
        const inFriends = !!store.users.find(user => user.user_id === user_id);
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
    _dhtMulticast(type, data) {
        try {
            for (const cid in this.peers) {
                const socket = this.peers[cid];
                if (!socket || !socket.dogma) {
                    /**
                     * @todo delete closed sockets
                     */
                    logger.error("DHT", "_dhtMulticast", "unknown socket", cid, socket.dogma);
                    continue;
                }
                if (!this._canUse(type, socket.dogma.user_id))
                    continue;
                socket.multiplex.dht.write(JSON.stringify(Object.assign({ action: "get", type }, data)));
            }
        }
        catch (err) {
            logger.error("dht.js", "dhtMulticast", err);
        }
    }
}
module.exports = DHT;
