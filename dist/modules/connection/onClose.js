"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { emit } = require("../state");
const { Connection } = require("../model");
const logger = require('../../logger');
/**
 *
 * @param {Object} socket connection
 *
 */
module.exports = function (socket) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!socket.dogma)
            return logger.log("connection", "closed socket with unknown attr");
        const { connection_id, node_id } = socket.dogma;
        emit("offline", node_id);
        this._offline(node_id);
        logger.info("connection", "closed", connection_id);
        try {
            yield Connection.delete(connection_id);
            logger.log("connection", "successfully deleted connection", connection_id);
        }
        catch (err) {
            logger.error("connection", "can't delete connection", err);
        }
    });
};
