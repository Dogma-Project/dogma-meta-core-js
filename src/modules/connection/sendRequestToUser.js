const { Connection } = require("../model");
const { MESSAGES } = require("../constants");
const logger = require("../../logger");

/**
 * 
 * @param {String} user_id user hash
 * @param {Object} request 
 * @param {String} request.type
 * @param {String} request.action
 * @param {*} request.data optional
 * @returns {Promise} { id,code,message }
 */
module.exports = async function (user_id, request) {
    try {
        const nodes = await Connection.getConnDataByUserId(user_id);
        nodes.forEach((node) => {
            this.sendRequestToNode(node.node_id, request, MESSAGES.USER);
        });
    } catch (err) {
        logger.error("connection", "sendRequestToUser", err);
    }
}