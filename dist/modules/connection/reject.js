"use strict";
const logger = require('../../logger');
module.exports = function (socket, ...message) {
    socket.destroy();
    logger.error("connection", ...message);
};
