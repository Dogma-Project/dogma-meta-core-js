const logger = require('../../logger');
const { Connection } = require("../model");
const { emit } = require("../state");
const { store } = require("../store");

/**
 * 
 * @param {Object} socket connection
 */
module.exports = async function (socket) {

    let { connection_id, node_id, address, user_id } = socket.dogma;
    const { authorized } = socket;
    const mySelf = (node_id === store.node.id);
    const own = (user_id === store.user.id);

    if (mySelf) { // check
        address = address.replace(address.split(":")[1], store.config.router); // change to regular expressions
        logger.log("connection", "self connected", address);
    }

    try {
        await Connection.push({ connection_id, user_id, node_id, address, authorized });
    } catch (err) {
        if (mySelf) return logger.log("connection", "skip self connection");
        return this.reject(socket, null); // temp
    }

    emit("online", { node_id, own, mySelf });
    this._online(node_id);
    logger.info("accepted connection", node_id, address, `own: ${own}, mySelf: ${mySelf}`);

}