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
const constants_1 = require("../../constants");
const state_1 = require("../state");
const nedb_1 = require("../nedb");
const generateSyncId_1 = __importDefault(require("../../libs/generateSyncId"));
const sync_1 = __importDefault(require("./sync"));
const logger_1 = __importDefault(require("../../libs/logger"));
const model = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.users.findAsync({});
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
                (0, state_1.emit)("update-user", user_id);
                const exist = yield nedb_1.users.findOneAsync({ user_id });
                const sync_id = (0, generateSyncId_1.default)(5);
                let result;
                if (exist && exist.user_id) {
                    if (!exist.sync_id)
                        user.sync_id = sync_id;
                    result = yield nedb_1.users.updateAsync({ user_id }, { $set: user });
                }
                else {
                    result = yield nedb_1.users.insertAsync(Object.assign(Object.assign({}, user), { sync_id }));
                }
                (0, state_1.emit)("users-db", constants_1.STATES.RELOAD); // downgrade state to reload database
                return result;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     * @todo set to deleted state instead of remove
     */
    removeUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield nedb_1.users.removeAsync({ user_id }, { multi: true });
                (0, state_1.emit)("users-db", constants_1.STATES.RELOAD); // downgrade state to reload database
                yield nedb_1.nodes.removeAsync({ user_id }, { multi: true });
                (0, state_1.emit)("nodes-db", constants_1.STATES.RELOAD); // downgrade state to reload database
                return true;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     * @todo delete _id
     */
    sync(data, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const row of data) {
                    const { sync_id, user_id } = row;
                    if (!sync_id) {
                        logger_1.default.debug("node", "sync", "unknown sync_id", sync_id);
                        continue;
                    }
                    // delete row._id;
                    yield nedb_1.users.updateAsync({ $or: [{ user_id }, { sync_id }] }, row, {
                        upsert: true,
                    });
                }
                (0, state_1.emit)("users-db", constants_1.STATES.RELOAD); // downgrade state to reload database
                sync_1.default.confirm("users", from);
                return true;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    //   /**
    //    *
    //    * @param {String} node_id
    //    * @returns
    //    */
    //   async getSync(node_id: ) {
    //     try {
    //       const updated = await Sync.get("users", node_id);
    //       const time = updated && updated.time ? updated.time : 1;
    //       const nedbTime = new Date(time);
    //       return usersDb.findAsync({
    //         sync_id: { $exists: true },
    //         updatedAt: { $gt: nedbTime },
    //       });
    //     } catch (err) {
    //       return Promise.reject(err);
    //     }
    //     },
};
exports.default = model;
