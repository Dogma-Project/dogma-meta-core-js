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
const { messages: messagesDb } = require("../nedb");
const { MESSAGES } = require("../constants");
const Sync = require("./sync");
const model = module.exports = {
    /**
     *
     * @param {Number} type
     */
    getAll(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return messagesDb.findAsync({ type }).sort({ createdAt: 1 });
        });
    },
    /**
     *
     * @param {Object} params
     * @param {String} params.id
     * @param {Number} params.since timestamp (should implement)
     * @param {Number} params.type
     */
    get({ id, since, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            return messagesDb.findAsync({ type, id }).sort({ createdAt: 1 });
        });
    },
    /**
     *
     * @param {Object} params
     * @param {String} params.id
     * @param {Number} params.type
     * @returns {Promise}
     */
    getStatus({ id, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // return messagesDb.findAsync({ type, id }).sort({ createdAt: -1 }).limit(1);
                const message = yield messagesDb.findOneAsync({ type, id }).sort({ createdAt: -1 });
                const text = message ? (message.text || (message.files && "File")) : "...";
                const from = message ? (message.direction) : null;
                return {
                    text,
                    from,
                    newMessages: 0
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
            params.type = params.type || MESSAGES.DIRECT;
            return messagesDb.insertAsync(params);
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
                    yield messagesDb.updateAsync({ sync_id }, row, { upsert: true });
                }
                Sync.confirm("messages", from);
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
                const updated = yield Sync.get("messages", node_id);
                const time = updated && updated.time ? updated.time : 1;
                const nedbTime = new Date(time);
                return messagesDb.findAsync({ sync_id: { $exists: true }, updatedAt: { $gt: nedbTime }, $not: { direction: MESSAGES.DIRECT } });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
