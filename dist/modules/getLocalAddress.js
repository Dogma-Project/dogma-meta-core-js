"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalAddress = exports.convertToBroadcast = void 0;
const node_os_1 = __importDefault(require("node:os"));
const ifaces = node_os_1.default.networkInterfaces();
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
exports.convertToBroadcast = convertToBroadcast;
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
    broadcast = (0, exports.convertToBroadcast)(address);
    return { address, broadcast };
};
exports.getLocalAddress = getLocalAddress;
