const { Connection } = require("../model");
const logger = require("../../logger");
const { EncodeStream } = require("../streams");

/**
* @param {Object} params
* @param {String} params.node_id 
* @param {Number} params.descriptor
* @returns {Promise} with Writable Socket Stream
*/
module.exports = async function ({ node_id, descriptor }) {
    try {
        const result = await Connection.getConnDataByNodeId(node_id);
        if (!result) return logger.warn("connection", "connection id didn't find", node_id); // edit try catch
        const socket = this.peers[result.connection_id];
        const encoder = new EncodeStream({ highWaterMark: this.highWaterMark, descriptor });
        encoder.on("error", (err) => logger.error("connection", "stream encode error", err));
        encoder.pipe(socket.multiplex.files, { end: false }); // edit
        return encoder;
    } catch (err) {
        logger.error("connection", "stream to node error::", err);
    }
}