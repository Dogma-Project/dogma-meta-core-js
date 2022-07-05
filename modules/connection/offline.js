const logger = require('../../logger');
const EventEmitter = require("../eventEmitter");

/**
 * 
 * @param {String} node_id node hash
 */
module.exports = function (node_id) {
    const index = this.online.indexOf(node_id);
    if (index !== -1) {
        logger.log("connection", "OFFLINE", node_id);
        this.online.splice(index, 1);
        EventEmitter.emit("friends", true); // edit node_id
        EventEmitter.emit("connections", true); // edit connection_id
    }
}