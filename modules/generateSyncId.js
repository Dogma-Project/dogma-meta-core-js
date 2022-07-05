const { randomBytes } = require("crypto");

/**
 * @param {Number} size *2
 */
const generateSyncId = module.exports = (size = 6) => {
    size = Number(size) || 6;
    const time = new Date().getTime();
    return randomBytes(size).toString("hex") + time.toString().slice(-size);
}