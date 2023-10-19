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
const nedb_1 = require("../nedb");
const constants_1 = require("../../constants");
const sync_1 = __importDefault(require("./sync"));
const model = {
    getAll(type) {
        return __awaiter(this, void 0, void 0, function* () {
            // edit type
            return nedb_1.messages.findAsync({ type }).sort({ createdAt: 1 });
        });
    },
    get({ id, since, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            // edit types
            return nedb_1.messages.findAsync({ type, id }).sort({ createdAt: 1 });
        });
    },
    getStatus({ id, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            // edit types
            try {
                // return messagesDb.findAsync({ type, id }).sort({ createdAt: -1 }).limit(1);
                const message = yield nedb_1.messages
                    .findOneAsync({ type, id })
                    .sort({ createdAt: -1 });
                const text = message ? message.text || (message.files && "File") : "...";
                const from = message ? message.direction : null;
                return {
                    text,
                    from,
                    newMessages: 0,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     *
     * @param {Object} params
     * @param {String} params.id
     * @param {String} params.message
     * @param {String} params.sync_id
     * @param {Number} params.direction
     * @param {Number} params.format
     * @param {Number} params.type
     */
    push(params) {
        return __awaiter(this, void 0, void 0, function* () {
            params.type = params.type || constants_1.MESSAGES.DIRECT;
            return nedb_1.messages.insertAsync(params);
        });
    },
    /**
     *
     * @param {Array} data
     * @param {String} from node_id
     */
    sync(data, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const row of data) {
                    const { _id, sync_id } = row;
                    if (!sync_id) {
                        logger.debug("node", "sync", "unknown sync_id", _id);
                        continue;
                    }
                    delete row._id;
                    yield nedb_1.messages.updateAsync({ sync_id }, row, { upsert: true });
                }
                sync_1.default.confirm("messages", from);
                return true;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     *
     * @param {String} node_id
     * @returns
     */
    getSync(node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield sync_1.default.get("messages", node_id);
                const time = updated && updated.time ? updated.time : 1;
                const nedbTime = new Date(time);
                return nedb_1.messages.findAsync({
                    sync_id: { $exists: true },
                    updatedAt: { $gt: nedbTime },
                    $not: { direction: constants_1.MESSAGES.DIRECT },
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
};
exports.default = model;
