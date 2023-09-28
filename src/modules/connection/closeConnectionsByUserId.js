const { Connection } = require("../model");
const logger = require('../../logger');
const { emit } = require("../state");

/**
 * 
 * @param {String} user_id
 */
module.exports = async function (user_id) {
    const { peers } = this;
    try {
        const result = await Connection.getConnDataByUserId(user_id);
        for (const row of result) {
            peers[row.connection_id].destroy();
        }
        emit("update-user", false);
    } catch (err) {
        logger.error("connection.js", "closeConnectionsByUserId", err);
    }
}