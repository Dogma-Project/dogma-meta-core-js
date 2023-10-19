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
const state_1 = require("../state");
const model_1 = require("../../libs/model");
const logger_1 = __importDefault(require("../../libs/logger"));
function onClose(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!("dogma" in socket)) {
            return logger_1.default.log("connection", "closed socket with unknown attr");
        }
        const { connection_id, node_id } = socket.dogma;
        (0, state_1.emit)("offline", node_id);
        this._offline(node_id);
        logger_1.default.info("connection", "closed", connection_id);
        try {
            yield model_1.Connection.delete(connection_id);
            logger_1.default.log("connection", "successfully deleted connection", connection_id);
        }
        catch (err) {
            logger_1.default.error("connection", "can't delete connection", err);
        }
    });
}
exports.default = onClose;
