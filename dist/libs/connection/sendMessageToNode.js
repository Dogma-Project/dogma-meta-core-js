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
const messages_1 = __importDefault(require("../../libs/messages"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../libs/logger"));
const files_1 = __importDefault(require("../controllers/files"));
const response_1 = __importDefault(require("./response"));
function send(node_id, message, type = constants_1.MESSAGES.DIRECT) {
    return __awaiter(this, void 0, void 0, function* () {
        // edit // add read status message
        try {
            const result = yield model_1.Connection.getConnDataByNodeId(node_id);
            if (!result)
                return (0, response_1.default)(-1, constants_1.MSG_CODE.UNKNOWN); // edit try catch
            const { user_id, connection_id } = result;
            const socket = this.peers[connection_id];
            let { text, files } = message;
            text = text || "";
            files = files || [];
            /** attachments */
            for (let i = 0; i < files.length; i++) {
                try {
                    const file = files[i];
                    const { descriptor, pathname } = yield files_1.default.permitFileTransfer({ user_id, file });
                    files[i] = Object.assign(Object.assign({}, file), { descriptor, pathname });
                }
                catch (err) {
                    logger_1.default.error("sendMessageToNode", "permit file transfer", err);
                }
            }
            const filesData = files.map((file) => {
                const { name, size, type, descriptor } = file;
                return { name, size, type, descriptor };
            });
            const id = type === constants_1.MESSAGES.DIRECT ? node_id : user_id;
            const sync_id = yield messages_1.default.commit({
                id,
                text,
                files: filesData,
                direction: constants_1.DIRECTION.OUTCOMING,
                format: constants_1.MSG_FORMAT.COMMON,
                type,
            });
            socket.multiplex.messages.write(JSON.stringify({
                text,
                files: filesData,
                type,
            }));
            return (0, response_1.default)(sync_id, constants_1.MSG_CODE.SUCCESS);
        }
        catch (err) {
            logger_1.default.error("connection", "SEND TO NODE::", err);
            return (0, response_1.default)(-1, constants_1.MSG_CODE.ERROR, "can't send message"); // edit !!!
        }
    });
}
exports.default = send;
