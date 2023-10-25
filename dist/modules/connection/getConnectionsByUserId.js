"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getConnectionsByUserId(user_id) {
    let connections = [];
    for (const cid in this.peers) {
        if (this.peers[cid].user_id === user_id)
            connections.push(this.peers[cid]);
    }
    return connections;
}
exports.default = getConnectionsByUserId;
