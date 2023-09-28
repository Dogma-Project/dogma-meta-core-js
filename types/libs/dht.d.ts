export = DHT;
/** @module DHT */
declare class DHT extends EventEmitter {
    /**
     *
     */
    constructor();
    peers: any[];
    permissions: {
        dhtBootstrap: number;
        dhtAnnounce: number;
        dhtLookup: number;
    };
    /**
     *
     * @param {Array} peers array of active connections
     */
    setPeers(peers: any[]): void;
    /**
     *
     * @param {String} type dhtAnnounce, dhtBootstrap, dhtLookup
     * @param {Number} level 0, 1, 2, 3
     */
    setPermission(type: string, level: number): any;
    /**
     * Sends announce to all online connections
     * @param {Number} port
     */
    announce(port: number): void;
    /**
     * Sends DHT lookup request to all online connections
     * @param {String} user_id user's hash
     * @param {String} node_id [optional] node hash
     */
    lookup(user_id: string, node_id?: string): void;
    revoke(): void;
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
    handleRequest(params: {
        request: {
            type: string;
            action: string;
            port: number;
            user_id: string;
            node_id: string;
        };
        from: {
            user_id: string;
            node_id: string;
            public_ipv4: string;
        };
    }, socket: Object): Promise<any>;
    /**
     * Controller
     * @private
     * @param {Object} params
     * @param {Object} params.from
     * @param {Object} params.request
     * @returns {Promise}
     */
    private _handleAnnounce;
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
    private _handleLookup;
    /**
     * Controller
     * @private
     * @param {Object} params
     * @param {Object} params.from
     * @param {Object} params.request
     */
    private _handleRevoke;
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
    private _handlePeers;
    /**
     * Check access level to DHT requests. Handled level can't be 0
     * @param {String} type
     * @param {String} user_id
     * @returns {Boolean}
     * @private
     */
    private _canUse;
    /**
     * Send request to all nodes
     * @private
     * @param {String} type announce, lookup, revoke
     * @param {Object} data
     * @param {Number} data.port [optional] for announce
     * @param {String} data.user_id [optional] for lookup
     * @param {String} data.node_id [optional] for lookup. only when looking for specific node
     */
    private _dhtMulticast;
}
import EventEmitter = require("events");
