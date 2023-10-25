"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalAddress = void 0;
const node_os_1 = __importDefault(require("node:os"));
const ifaces = node_os_1.default.networkInterfaces();
/**
 * @todo fix
 */
const getLocalAddress = (family = "IPv4") => {
    // edit
    let array = [];
    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            if (iface.family !== family || iface.internal !== false)
                return;
            array.push(iface);
        });
    });
    return array;
};
exports.getLocalAddress = getLocalAddress;
