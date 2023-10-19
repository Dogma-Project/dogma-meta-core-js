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
/**
 *
 * @param {String} user_id user hash
 * @param {Object} request
 * @param {String} request.type
 * @param {String} request.action
 * @param {*} request.data optional
 * @returns {Promise} { id,code,message }
 */
function send(user_id, request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nodes = yield model_1.Connection.getConnDataByUserId(user_id);
            nodes.forEach((node) => {
                this.sendRequestToNode(node.node_id, request, constants_1.MESSAGES.USER);
            });
        }
        catch (err) {
            logger_1.default.error("connection", "sendRequestToUser", err);
        }
    });
}
exports.default = send;
