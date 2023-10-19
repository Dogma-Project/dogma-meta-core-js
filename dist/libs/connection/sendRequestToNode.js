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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../../libs/model");
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../libs/logger"));
const response_1 = __importDefault(require("./response"));
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
function send(node_id, request, type = constants_1.MESSAGES.DIRECT) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield model_1.Connection.getConnDataByNodeId(node_id);
            if (!result)
                return (0, response_1.default)(1, constants_1.MSG_CODE.UNKNOWN, "user is offline"); // edit try catch
            const { connection_id } = result;
            const socket = this.peers[connection_id];
            socket.multiplex.control.write(JSON.stringify(request));
            return (0, response_1.default)(1, constants_1.MSG_CODE.SUCCESS);
        }
        catch (err) {
            logger_1.default.error("connection", "SEND TO NODE::", err);
            return (0, response_1.default)(1, constants_1.MSG_CODE.ERROR, "can't send request"); // edit text
        }
    });
}
exports.default = send;
