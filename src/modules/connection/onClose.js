const { emit } = require("../state");
const { Connection } = require("../model");
const logger = require('../../logger');

/**
 * 
 * @param {Object} socket connection
 * 
 */
module.exports = async function (socket) {
    if (!socket.dogma) return logger.log("connection", "closed socket with unknown attr");
    const { connection_id, node_id } = socket.dogma;
    emit("offline", node_id);
    this._offline(node_id);
    logger.info("connection", "closed", connection_id);
    try {
        await Connection.delete(connection_id);
        logger.log("connection", "successfully deleted connection", connection_id);
    } catch (err) {
        logger.error("connection", "can't delete connection", err);
    }
}