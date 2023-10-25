"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function peerFromIP(ip) {
    const [host, port] = ip.split(":");
    const peer = {
        host,
        port: Number(port),
        address: ip,
    };
    return peer;
}
exports.default = peerFromIP;
