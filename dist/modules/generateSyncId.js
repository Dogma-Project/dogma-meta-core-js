"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
/**
 * @param size *2
 */
const generateSyncId = (size = 6) => {
    size = Number(size) || 6;
    const time = new Date().getTime();
    return (0, node_crypto_1.randomBytes)(size).toString("hex") + time.toString().slice(-size);
};
exports.default = generateSyncId;
