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
const EventEmitter = require("./eventEmitter");
const { Message } = require("./model");
const generateSyncId = require("./generateSyncId");
const { emit } = require("./state");
/** @module Messages */
module.exports = {
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
            const sync_id = generateSyncId(6);
            const data = { id, sync_id, text, files, direction, format, type };
            yield Message.push(data);
            if (data.type)
                emit("new-message", data); // check
            const time = new Date().getTime();
            EventEmitter.emit("messages", {
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
