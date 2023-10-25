"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getConnectionByNodeId(node_id) {
    let connection = null;
    for (const cid in this.peers) {
        if (this.peers[cid].node_id === node_id)
            connection = this.peers[cid];
    }
    return connection;
}
exports.default = getConnectionByNodeId;
