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
 * @param {String} user_id user hash
 * @param {Object} request
 * @param {String} request.type
 * @param {String} request.action
 * @param {*} request.data optional
 * @returns {Promise} { id,code,message }
 */
module.exports = function (user_id, request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nodes = yield Connection.getConnDataByUserId(user_id);
            nodes.forEach((node) => {
                this.sendRequestToNode(node.node_id, request, MESSAGES.USER);
            });
        }
        catch (err) {
            logger.error("connection", "sendRequestToUser", err);
        }
    });
};
