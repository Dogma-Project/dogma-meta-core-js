const { Connection } = require("../model");
const { MSG_CODE, MESSAGES } = require("../constants");
const logger = require("../../logger");

/**
 * 
 * @param {String} node_id node hash
 * @param {Object} request 
 * @param {String} request.type
 * @param {String} request.action
 * @param {*} request.data optional
 * @param {Number} type direct, user, chat
 * @returns {Promise} { id,code,message }
 */
module.exports = async function (node_id, request, type = MESSAGES.DIRECT) {

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
        if (!result) return response(1, MSG_CODE.UNKNOWN, "user is offline"); // edit try catch
        const { connection_id } = result;
        const socket = this.peers[connection_id];
        socket.multiplex.control.write(JSON.stringify(request));
        return response(1, MSG_CODE.SUCCESS);
    } catch (err) {
        logger.error("connection", "SEND TO NODE::", err);
        return response(1, MSG_CODE.ERROR, "can't send request"); // edit text		
    }
}