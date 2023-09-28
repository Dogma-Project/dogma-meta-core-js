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
module.exports = function (node_id, request, type = MESSAGES.DIRECT) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         *
         * @param {Number} id
         * @param {Number} code
         * @param {String} message optional
         * @returns {Object}
         */
        const response = (id, code, message) => {
            let res = { id, code };
            if (message)
                res.message = message;
            return res;
        };
        try {
            const result = yield Connection.getConnDataByNodeId(node_id);
            if (!result)
                return response(1, MSG_CODE.UNKNOWN, "user is offline"); // edit try catch
            const { connection_id } = result;
            const socket = this.peers[connection_id];
            socket.multiplex.control.write(JSON.stringify(request));
            return response(1, MSG_CODE.SUCCESS);
        }
        catch (err) {
            logger.error("connection", "SEND TO NODE::", err);
            return response(1, MSG_CODE.ERROR, "can't send request"); // edit text		
        }
    });
};
