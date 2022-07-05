const { Connection } = require("../model");
const { MESSAGES } = require("../constants");
const logger = require("../../logger");

/**
 * 
 * @param {String} user_id 
 * @param {Object} message 
 * @param {String} message.text optional
 * @param {Array} message.files optional
 * @returns {Promise} {id,code,message}
 */
module.exports = async function (user_id, message) { // edit priority
    try {
        const nodes = await Connection.getConnDataByUserId(user_id);
        if (!nodes.length) return logger.warn("connection", "sendMessageToUser", "user is offline");
        const { node_id } = nodes[0]; // edit
        node_id && this.sendMessageToNode(node_id, message, MESSAGES.USER);
    } catch (err) {
        logger.error("connection", "sendMessageToUser", err);
    }
}