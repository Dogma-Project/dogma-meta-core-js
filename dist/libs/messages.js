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
const eventEmitter_1 = __importDefault(require("../components/eventEmitter"));
const model_1 = require("./model");
const generateSyncId_1 = __importDefault(require("./generateSyncId"));
const state_1 = require("./state");
/** @module Messages */
const messages = {
    /**
     *
     * @param {Object} params
     * @param {String} params.id
     * @param {String} params.text
     * @param {Array} params.files
     * @param {Number} params.direction
     * @param {Number} params.format
     * @param {Number} params.type
     */
    commit: ({ id, text, files, direction, format, type }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sync_id = (0, generateSyncId_1.default)(6);
            const data = { id, sync_id, text, files, direction, format, type };
            yield model_1.Message.push(data);
            if (data.type)
                (0, state_1.emit)("new-message", data); // check
            const time = new Date().getTime();
            eventEmitter_1.default.emit("messages", {
                // return to own node
                code: 1,
                data: Object.assign({ createdAt: time }, data),
            });
            return sync_id;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }),
};
exports.default = messages;
