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
const { STATES } = require("../constants");
const { emit } = require("../state");
const { users: usersDb, nodes: nodesDb } = require("../nedb");
const generateSyncId = require("../generateSyncId");
const Sync = require("./sync");
const model = module.exports = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return usersDb.findAsync({});
        });
    },
    /**
     *
     * @param {Object} user
     * @param {String} user.name
     * @param {String} user.user_id
     * @param {String} user.cert
     * @param {Number} user.type
     * @returns {Promise}
     */
    persistUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = user;
                emit("update-user", user_id);
                const exist = yield usersDb.findOneAsync({ user_id });
                const sync_id = generateSyncId(5);
                let result;
                if (exist && exist.user_id) {
                    if (!exist.sync_id)
                        user.sync_id = sync_id;
                    result = yield usersDb.updateAsync({ user_id }, { $set: user });
                }
                else {
                    result = yield usersDb.insertAsync(Object.assign(Object.assign({}, user), { sync_id }));
                }
                emit("users-db", STATES.RELOAD); // downgrade state to reload database
                return result;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     *
     * @param {String} user_id
     * @todo set to deleted state instead of remove
     */
    removeUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield usersDb.removeAsync({ user_id }, { multi: true });
                emit("users-db", STATES.RELOAD); // downgrade state to reload database
                yield nodesDb.removeAsync({ user_id }, { multi: true });
                emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
                return true;
            }
            catch (err) {
                return Promise.reject(err);
            }
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
                    const { _id, sync_id, user_id } = row;
                    if (!sync_id) {
                        logger.debug("node", "sync", "unknown sync_id", _id);
                        continue;
                    }
                    delete row._id;
                    yield usersDb.updateAsync({ $or: [{ user_id }, { sync_id }] }, row, { upsert: true });
                }
                emit("users-db", STATES.RELOAD); // downgrade state to reload database
                Sync.confirm("users", from);
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
                const updated = yield Sync.get("users", node_id);
                const time = updated && updated.time ? updated.time : 1;
                const nedbTime = new Date(time);
                return usersDb.findAsync({ sync_id: { $exists: true }, updatedAt: { $gt: nedbTime } });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
