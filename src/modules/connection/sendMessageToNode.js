const { Connection } = require("../model");
const messages = require("../messages");
const { DIRECTION, MSG_FORMAT, MSG_CODE, MESSAGES } = require("../constants");
const logger = require("../../logger");
const FilesController = require("../controllers/files");

/**
 * 
 * @param {String} node_id node hash
 * @param {Object} message 
 * @param {String} message.text optional
 * @param {Array} message.files optional [{ name, size, type, pathname, data }]
 * @param {Number} type optional, default - DIRECT
 * @returns {Promise} {id,code,message}
 */
module.exports = async function (node_id, message, type = MESSAGES.DIRECT) { // edit // add read status message 

    /**
     * 
     * @param {Number} id 
     * @param {Number} code 
     * @param {String} message optional
     * @returns {Object}
     */
    const response = (id, code, message) => { // edit
        let res = { id, code };
        if (message) res.message = message;
        return res;
    }
    try {
        const result = await Connection.getConnDataByNodeId(node_id);
        if (!result) return response(null, MSG_CODE.UNKNOWN); // edit try catch
        const { user_id, connection_id } = result;
        const socket = this.peers[connection_id];
        let { text, files } = message;
        text = text || "";
        files = files || [];

        /** attachments */
        for (let i = 0; i < files.length; i++) {
            try {
                const file = files[i];
                const { descriptor, pathname } = await FilesController.permitFileTransfer({ user_id, file });
                files[i] = { ...file, descriptor, pathname };
            } catch (err) {
                logger.error("sendMessageToNode", "permit file transfer", err);
            }
        }
        const filesData = files.map((file) => {
            const { name, size, type, descriptor } = file;
            return { name, size, type, descriptor };
        });
        const sync_id = await messages.commit({
            id: (type === MESSAGES.DIRECT) ? node_id : user_id,
            text,
            files: filesData,
            direction: DIRECTION.OUTCOMING,
            format: MSG_FORMAT.COMMON,
            type
        });
        socket.multiplex.messages.write(JSON.stringify({
            text,
            files: filesData,
            type
        }));
        return response(sync_id, MSG_CODE.SUCCESS);
    } catch (err) {
        logger.error("connection", "SEND TO NODE::", err);
        return response(sync_id, MSG_CODE.ERROR, "can't send message"); // edit text
    }
}