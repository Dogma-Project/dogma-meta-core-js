"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
/**
 * @param size *2
 */
const generateSyncId = (size = 6) => {
    size = Number(size) || 6;
    const time = new Date().getTime();
    return (0, crypto_1.randomBytes)(size).toString("hex") + time.toString().slice(-size);
};
exports.default = generateSyncId;
module.exports = generateSyncId;
