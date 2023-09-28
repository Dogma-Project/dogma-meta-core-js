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
const { Connection } = require("../model");
const { MESSAGES } = require("../constants");
const logger = require("../../logger");
/**
 *
 * @param {String} user_id
 * @param {Object} message
 * @param {String} message.text optional
 * @param {Array} message.files optional
 * @returns {Promise} {id,code,message}
 */
module.exports = function (user_id, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nodes = yield Connection.getConnDataByUserId(user_id);
            if (!nodes.length)
                return logger.warn("connection", "sendMessageToUser", "user is offline");
            const { node_id } = nodes[0]; // edit
            node_id && this.sendMessageToNode(node_id, message, MESSAGES.USER);
        }
        catch (err) {
            logger.error("connection", "sendMessageToUser", err);
        }
    });
};
