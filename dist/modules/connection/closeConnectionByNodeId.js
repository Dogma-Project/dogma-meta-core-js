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
const logger = require('../../logger');
/**
 *
 * @param {String} node_id
 */
module.exports = function (node_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { peers } = this;
        try {
            const result = yield Connection.getConnDataByNodeId(node_id);
            peers[result.connection_id].destroy();
        }
        catch (err) {
            logger.error("connection.js", "closeConnectionByNodeId", err);
        }
    });
};
