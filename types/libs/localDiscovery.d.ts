/// <reference types="node" />
export = LocalDiscovery;
declare class LocalDiscovery extends EventEmitter {
    /**
     *
     * @param {Object} params
     * @param {Number} params.port default: 45432
     * @param {String} params.ip default: 0.0.0.0
     */
    constructor({ port, ip }: {
        port: number;
        ip: string;
    });
    ip: string;
    port: number;
    broadcast: string;
    startServer(): this;
    server: dgram.Socket | undefined;
    /**
     *
     * @param {Object} card
     * @param {String} card.type
     * @param {String} card.user_id
     * @param {String} card.node_id
     * @param {Number} card.port
     */
    announce(card: {
        type: string;
        user_id: string;
        node_id: string;
        port: number;
    }): this;
}
import EventEmitter = require("events");
import dgram = require("dgram");
