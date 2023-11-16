"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_dgram_1 = __importDefault(require("node:dgram"));
const node_events_1 = __importDefault(require("node:events"));
const getLocalAddress_1 = require("./getLocalAddress");
/** @module LocalDiscovery */
class LocalDiscovery extends node_events_1.default {
    constructor({ port = 45432, ip = "0.0.0.0" }) {
        super();
        const { address, broadcast } = (0, getLocalAddress_1.getLocalAddress)(ip);
        // this.ip = address;
        this.ip = "0.0.0.0";
        this.port = port;
        this.broadcast = broadcast;
        this.server = node_dgram_1.default.createSocket({
            type: "udp4",
            reuseAddr: true,
        });
    }
    startServer() {
        this.server.on("listening", () => {
            const address = this.server.address();
            this.emit("ready", {
                address,
            });
        });
        this.server.on("message", (msg, from) => {
            // add validation
            const decoded = JSON.parse(msg.toString());
            const { address } = from;
            const { type, user_id, node_id, port } = decoded;
            const response = {
                type,
                user_id,
                node_id,
                local_ipv4: `${address}:${port}`,
            };
            this.emit("candidate", response);
        });
        this.server.on("error", (err) => this.emit("error", {
            type: "server",
            err,
        }));
        this.server.bind({
            port: this.port,
            address: this.ip,
        }, () => {
            this.server.setBroadcast(true);
        });
        return this;
    }
    announce(card) {
        const message = JSON.stringify(card);
        this.server.send(message, 0, message.length, this.port, this.broadcast, (err, _bytes) => {
            if (err) {
                this.emit("error", {
                    type: "client",
                    err,
                });
            }
            else {
                console.log("sent broadcast message to", this.broadcast, this.port);
            }
        });
        return this;
    }
}
exports.default = LocalDiscovery;
