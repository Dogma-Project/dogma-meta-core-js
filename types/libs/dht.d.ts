/// <reference types="node" />
import EventEmitter from "node:events";
import { Types } from "../types";
/** @module DHT */
declare class DHT extends EventEmitter {
    permissions: {
        dhtBootstrap: number;
        dhtAnnounce: number;
        dhtLookup: number;
    };
    peers: Types.Connection.Socket[];
    /**
     *
     */
    constructor();
    /**
     *
     * @param {Array} peers array of active connections
     */
    setPeers(peers: Types.Connection.Socket[]): void;
    /**
     *
     * @param type dhtAnnounce, dhtBootstrap, dhtLookup
     * @param level 0, 1, 2, 3
     */
    setPermission(type: Types.DHT.Type, level: 0 | 1 | 2 | 3): void;
    /**
     * Sends announce to all online connections
     * @param {Number} port
     */
    announce(port: number): void;
    /**
     * Sends DHT lookup request to all online connections
     * @param user_id user's hash
     * @param node_id [optional] node hash
     */
    lookup(user_id: Types.User.Id, node_id?: Types.Node.Id): void;
    revoke(): void;
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
    handleRequest(params: Types.DHT.Card, socket: Types.Connection.Socket): Promise<void>;
    /**
     * Controller
     * @private
     * @param {Object} params
     * @param {Object} params.from
     * @param {Object} params.request
     * @returns {Promise}
     */
    _handleAnnounce({ from, request, }: {
        from: Types.DHT.FromData;
        request: Types.DHT.RequestData.Announce;
    }): Promise<unknown>;
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
    _handleLookup({ from, request, }: {
        from: Types.DHT.FromData;
        request: Types.DHT.RequestData.Lookup;
    }): Promise<unknown>;
    /**
     * Controller
     * @private
     * @param {Object} params
     * @param {Object} params.from
     * @param {Object} params.request
     */
    _handleRevoke({ from, request, }: {
        from: Types.DHT.FromData;
        request: Types.DHT.RequestData.Revoke;
    }): void;
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
    _handlePeers({ from, request, }: {
        from: Types.DHT.FromData;
        request: Types.DHT.RequestData.LookupAnswer;
    }): void;
    /**
     * Check access level to DHT requests. Handled level can't be 0
     * @param {String} type
     * @param {String} user_id
     * @returns {Boolean}
     * @private
     */
    _canUse(type: Types.DHT.Request, user_id: Types.User.Id): boolean | undefined;
    /**
     * Send request to all nodes
     * @private
     * @param {String} type announce, lookup, revoke
     * @param {Object} data
     * @param {Number} data.port [optional] for announce
     * @param {String} data.user_id [optional] for lookup
     * @param {String} data.node_id [optional] for lookup. only when looking for specific node
     */
    _dhtMulticast(type: Types.DHT.Request, data: Types.DHT.RequestData.Outgoing): void;
}
export default DHT;
