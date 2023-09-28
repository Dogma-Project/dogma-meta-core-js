const logger = require('../../logger');
const EventEmitter = require("../eventEmitter");

/**
 * 
 * @param {String} node_id node hash
 */
module.exports = function (node_id) {
    logger.log("connection", "ONLINE", node_id);
    this.online.push(node_id);
    EventEmitter.emit("friends", true); // edit node_id
    EventEmitter.emit("connections", true); // edit connection_id
}