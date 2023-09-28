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
const logger = require("../../logger");
const { EncodeStream } = require("../streams");
/**
* @param {Object} params
* @param {String} params.node_id
* @param {Number} params.descriptor
* @returns {Promise} with Writable Socket Stream
*/
module.exports = function ({ node_id, descriptor }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Connection.getConnDataByNodeId(node_id);
            if (!result)
                return logger.warn("connection", "connection id didn't find", node_id); // edit try catch
            const socket = this.peers[result.connection_id];
            const encoder = new EncodeStream({ highWaterMark: this.highWaterMark, descriptor });
            encoder.on("error", (err) => logger.error("connection", "stream encode error", err));
            encoder.pipe(socket.multiplex.files, { end: false }); // edit
            return encoder;
        }
        catch (err) {
            logger.error("connection", "stream to node error::", err);
        }
    });
};
