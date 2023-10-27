"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_dgram_1 = __importDefault(require("node:dgram"));
const node_events_1 = __importDefault(require("node:events"));
const node_os_1 = __importDefault(require("node:os"));
/** @module LocalDiscovery */
/**
 *
 * @param {String} ip "192.168.0.2"
 */
const convertToBroadcast = (ip) => {
    if (ip === "0.0.0.0")
        return "255.255.255.0"; // fallback
    const iparr = ip.split(".");
    iparr[3] = "255"; // broadcast
    return iparr.join(".");
};
/**
 *
 * @param {String} ip "192.168.0.2"
 */
const getLocalAddress = (ip = "") => {
    const ifaces = node_os_1.default.networkInterfaces();
    const pattern = "192.168.";
    let address, broadcast;
    if (ip.indexOf(pattern) === -1) {
        for (const ifname in ifaces) {
            const iface = ifaces[ifname];
            if (iface) {
                for (const ifname in iface) {
                    const inner = iface[ifname];
                    if (inner.family !== "IPv4" ||
                        inner.internal !== false ||
                        inner.address.indexOf(pattern) === -1) {
                        continue;
                    }
                    address = inner.address;
                }
            }
        }
        if (!address) {
            console.warn("Local Discovery Lib", "can't determine local address. fallback to 0.0.0.0");
            address = "0.0.0.0";
        }
    }
    else {
        address = ip;
    }
    broadcast = convertToBroadcast(address);
    return { address, broadcast };
};
class LocalDiscovery extends node_events_1.default {
    constructor({ port = 45432, ip = "0.0.0.0" }) {
        super();
        const { address, broadcast } = getLocalAddress(ip);
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