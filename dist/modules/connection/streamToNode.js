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
const model_1 = require("../model");
const logger_1 = __importDefault(require("../logger"));
const streams_1 = require("../streams");
function stream(node_id, descriptor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield model_1.Connection.getConnDataByNodeId(node_id);
            if (!result)
                return logger_1.default.warn("connection", "connection id didn't find", node_id); // edit try catch
            const socket = this.peers[result.connection_id];
            const encoder = new streams_1.EncodeStream({
                highWaterMark: this.highWaterMark,
                descriptor,
            });
            encoder.on("error", (err) => logger_1.default.error("connection", "stream encode error", err));
            encoder.pipe(socket.multiplex.files, { end: false }); // edit
            return encoder;
        }
        catch (err) {
            logger_1.default.error("connection", "stream to node error::", err);
        }
    });
}
exports.default = stream;
