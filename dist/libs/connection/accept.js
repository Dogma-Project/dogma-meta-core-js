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
const logger_1 = __importDefault(require("../../libs/logger"));
const model_1 = require("../../libs/model");
const state_1 = require("../state");
const store_1 = require("../store");
/**
 *
 * @param {Object} socket connection
 */
function accept(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        let { connection_id, node_id, address, user_id, status } = socket.dogma;
        const mySelf = node_id === store_1.store.node.id;
        const own = user_id === store_1.store.user.id;
        /*
        if (mySelf) {
          // check
          address = address.replace(address.split(":")[1], store.config.router); // change to regular expressions
          logger.log("connection", "self connected", address);
        }
        */
        try {
            yield model_1.Connection.push({
                connection_id,
                user_id,
                node_id,
                address,
                status,
            });
        }
        catch (err) {
            if (mySelf)
                return logger_1.default.log("connection", "skip self connection");
            return this.reject(socket, null); // temp
        }
        (0, state_1.emit)("online", { node_id, own, mySelf });
        this._online(node_id);
        logger_1.default.info("accepted connection", node_id, address, `own: ${own}, mySelf: ${mySelf}`);
    });
}
exports.default = accept;
