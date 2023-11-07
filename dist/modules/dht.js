"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Types = __importStar(require("../types"));
class DHT extends node_events_1.default {
    /**
     *
     */
    constructor({ storage, state, connections, model }) {
        super();
        this.peers = [];
        this.permissions = [
            0 /* Types.Connection.Group.unknown */,
            0 /* Types.Connection.Group.unknown */,
            0 /* Types.Connection.Group.unknown */,
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
    setPeers(peers) {
        this.peers = peers;
    }
    setPermission(type, level) {
        this.permissions[type] = level;
        logger_1.default.log("DHT", "setPermission", "set permission level", type, level); // change to log
    }
    announce(port) {
        const permission = this.permissions[0 /* Types.DHT.Type.dhtAnnounce */];
        const request = {
            class: 6 /* Types.Streams.MX.dht */,
            body: {
                type: 0 /* Types.DHT.Request.announce */,
                action: 2 /* Types.DHT.Action.push */,
                data: { port },
            },
        };
        this.connectionsBridge.multicast(request, permission);
    }
    lookup(user_id, node_id) {
        const permission = this.permissions[1 /* Types.DHT.Type.dhtLookup */];
        const request = {
            class: 6 /* Types.Streams.MX.dht */,
            body: {
                type: 1 /* Types.DHT.Request.lookup */,
                action: 0 /* Types.DHT.Action.get */,
                data: { user_id, node_id },
            },
        };
        this.connectionsBridge.multicast(request, permission);
    }
    revoke(user_id, node_id) {
        const permission = this.permissions[0 /* Types.DHT.Type.dhtAnnounce */];
        const request = {
            class: 6 /* Types.Streams.MX.dht */,
            body: {
                type: 2 /* Types.DHT.Request.revoke */,
                action: 2 /* Types.DHT.Action.push */,
                data: { user_id, node_id },
            },
        };
        this.connectionsBridge.multicast(request, permission);
    }
    handleRequest(params, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            // add validation
            try {
                const { request: { type, action }, from, } = params;
                if (!type || !action) {
                    return logger_1.default.warn("DHT", "handleRequest", "unknown request", type, action);
                }
                switch (params.request.type) {
                    case 0 /* Types.DHT.Request.announce */:
                        params.request;
                        yield this._handleAnnounce({
                            from,
                            request: params.request,
                        });
                        break;
                    case 2 /* Types.DHT.Request.revoke */:
                        yield this._handleRevoke({
                            from,
                            request: params.request,
                        });
                        break;
                    case 1 /* Types.DHT.Request.lookup */:
                        if (params.request.action === 0 /* Types.DHT.Action.get */) {
                            const peers = yield this._handleLookup({
                                from,
                                request: params.request,
                            });
                            if (peers && Object.keys(peers).length) {
                                const card = {
                                    action: 1 /* Types.DHT.Action.set */,
                                    type: 1 /* Types.DHT.Request.lookup */,
                                    data: peers,
                                };
                                socket.input.dht && socket.input.dht.write(JSON.stringify(card)); // edit
                            }
                        }
                        else if (params.request.action === 1 /* Types.DHT.Action.set */) {
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
    _handleAnnounce({ from, request, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { node_id, user_id, public_ipv4 } = from;
            const { port } = request.data;
            const full = { node_id, user_id, public_ipv4, port };
            return this.modelBridge.checkOrInsert(full);
        });
    }
    _handleLookup({ from, request, }) {
        return __awaiter(this, void 0, void 0, function* () {
            request;
            const { user_id, node_id } = request.data;
            let params = { user_id };
            if (node_id)
                params.node_id = node_id;
            try {
                const documents = yield this.modelBridge.get(params);
                const result = documents.map((item) => {
                    const { user_id, node_id, public_ipv4, port } = item;
                    return { user_id, node_id, public_ipv4, port };
                });
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    _handleRevoke({ from, request, }) {
        logger_1.default.debug("DHT", "handleRevoke", arguments);
    }
    _handlePeers({ from, request, }) {
        const { data } = request;
        this.emit("peers", data);
    }
}
exports.default = DHT;
