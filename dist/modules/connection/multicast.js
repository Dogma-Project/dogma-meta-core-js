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
Object.defineProperty(exports, "__esModule", { value: true });
const Types = __importStar(require("../../types"));
function multicast(request, destination) {
    if (destination === 0 /* Types.Connection.Group.unknown */)
        return;
    if (destination > 4 /* Types.Connection.Group.selfNode */)
        return;
    for (const cid in this.peers) {
        const socket = this.peers[cid];
        if (socket.group >= destination) {
            switch (request.class) {
                case 6 /* Types.Streams.MX.dht */:
                    socket.input.dht &&
                        socket.input.dht.write(JSON.stringify(request.body));
                    break;
                default:
                    request; // dummy
                    break;
            }
        }
    }
}
exports.default = multicast;
