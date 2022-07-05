const { Connection } = require("../model");
const logger = require('../../logger');

/**
 * 
 * @param {String} node_id 
 */
module.exports = async function (node_id) {
    const { peers } = this;
    try {
        const result = await Connection.getConnDataByNodeId(node_id);
        peers[result.connection_id].destroy();
    } catch (err) {
        logger.error("connection.js", "closeConnectionByNodeId", err);
    }
}