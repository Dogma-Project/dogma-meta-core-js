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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_events_1 = __importDefault(require("node:events"));
const logger_1 = __importDefault(require("./logger"));
const nedb_1 = require("../components/nedb");
const constants_1 = require("../constants");
const store_1 = require("./store");
/** @module DHT */
class DHT extends node_events_1.default {
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
    setPeers(peers) {
        this.peers = peers;
    }
    /**
     *
     * @param type dhtAnnounce, dhtBootstrap, dhtLookup
     * @param level 0, 1, 2, 3
     */
    setPermission(type, level) {
        if (!this.permissions.hasOwnProperty(type)) {
            return logger_1.default.warn("DHT", "setPermission", "unkonown permission type", type);
        }
        this.permissions[type] = level;
        logger_1.default.log("DHT", "setPermission", "set permission level", type, level); // change to log
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
     * @param user_id user's hash
     * @param node_id [optional] node hash
     */
    lookup(user_id, node_id) {
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
     * @param {String} params.request.user_id optional (only for lookup)
     * @param {String} params.request.node_id optional (only for lookup)
     * @param {Object} params.from determined by own node
     * @param {String} params.from.user_id user hash
     * @param {String} params.from.node_id node hash
     * @param {String} params.from.public_ipv4 host
     * @param {Object} socket [optional] for a feedback
     */
    handleRequest(params, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            // add validation
            try {
                const { request: { type, action }, request, from, } = params;
                if (!type || !action) {
                    return logger_1.default.warn("DHT", "handleRequest", "unknown request", type, action);
                }
                switch (params.request.type) {
                    case "announce":
                        params.request;
                        yield this._handleAnnounce({
                            from,
                            request: params.request,
                        });
                        break;
                    case "revoke":
                        yield this._handleRevoke({
                            from,
                            request: params.request,
                        });
                        break;
                    case "lookup":
                        if (params.request.action === "get") {
                            const peers = yield this._handleLookup({
                                from,
                                request: params.request,
                            });
                            if (peers && Object.keys(peers).length) {
                                socket.multiplex.dht.write(JSON.stringify({
                                    action: "set",
                                    type,
                                    data: peers,
                                }));
                            }
                        }
                        else if (params.request.action === "set") {
                            this._handlePeers({
                                from,
                                request: params.request,
                            });
                        }
                        break;
                }
            }
            catch (err) {
                logger_1.default.error("DHT", "handleRequest", err);
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
    _handleAnnounce({ from, request, }) {
        const { node_id, user_id, public_ipv4 } = from;
        const { port } = request;
        const conditions = { node_id, user_id };
        const full = { node_id, user_id, public_ipv4, port };
        if (!user_id || !node_id || !port) {
            logger_1.default.warn("DHT", "skip non-standard announce");
            return Promise.reject("non-standard announce");
        }
        // if (public_ipv4.indexOf("192.168.") > -1) return Promise.reject();
        return new Promise((resolve, reject) => {
            logger_1.default.info("DHT", "handled announce", `${public_ipv4}:${port}`);
            nedb_1.dht.find(full, (err, result) => {
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
                nedb_1.dht.update(conditions, full, { upsert: true }, (err, result) => {
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
    _handleLookup({ from, request, }) {
        const { public_ipv4 } = from;
        const { user_id, node_id } = request;
        return new Promise((resolve, reject) => {
            let params = { user_id };
            if (node_id)
                params.node_id = node_id;
            nedb_1.dht.find(params, (err, documents) => {
                if (err)
                    return reject(err);
                const result = documents.map((item) => {
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
    _handleRevoke({ from, request, }) {
        logger_1.default.debug("DHT", "handleRevoke", arguments);
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
    _handlePeers({ from, request, }) {
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
        if (permission === constants_1.DHTPERM.ALL)
            return true;
        const inFriends = !!store_1.store.users.find((user) => user.user_id === user_id);
        const own = store_1.store.user.id === user_id;
        if (permission >= constants_1.DHTPERM.ONLY_FRIENDS) {
            return inFriends || own;
        }
        if (permission >= constants_1.DHTPERM.ONLY_OWN) {
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
        // add validation
        try {
            for (const cid in this.peers) {
                const socket = this.peers[cid];
                if (!socket || !socket.dogma) {
                    /**
                     * @todo delete closed sockets
                     */
                    logger_1.default.error("DHT", "_dhtMulticast", "unknown socket", cid, socket.dogma);
                    continue;
                }
                if (!this._canUse(type, socket.dogma.user_id))
                    continue;
                socket.multiplex.dht.write(JSON.stringify(Object.assign({ action: "get", type }, data)));
            }
        }
        catch (err) {
            logger_1.default.error("dht.js", "dhtMulticast", err);
        }
    }
}
exports.default = DHT;
