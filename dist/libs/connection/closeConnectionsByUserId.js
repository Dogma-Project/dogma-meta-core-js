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
const logger_1 = __importDefault(require("../../libs/logger"));
const state_1 = require("../state");
function closeConnecion(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { peers } = this;
        try {
            const result = yield model_1.Connection.getConnDataByUserId(user_id);
            for (const row of result) {
                peers[row.connection_id].destroy();
            }
            (0, state_1.emit)("update-user", false);
        }
        catch (err) {
            logger_1.default.error("connection.js", "closeConnectionsByUserId", err);
        }
    });
}
exports.default = closeConnecion;
