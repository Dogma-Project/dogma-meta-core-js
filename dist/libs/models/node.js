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
const logger_1 = __importDefault(require("../../libs/logger"));
const sync_1 = __importDefault(require("./sync"));
const model = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.nodes.findAsync({});
        });
    },
    /**
     *
     * @param user_id
     */
    getByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.nodes.findAsync({ user_id });
        });
    },
    /**
     *
     * @param nodes [{name, node_id, user_id, public_ipv4, router_port}]
     * @returns {Promise}
     */
    persistNodes(nodes) {
        // add validation
        const insert = (row) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { node_id, user_id } = row;
                if (!row.public_ipv4)
                    delete row.public_ipv4;
                const exist = yield nedb_1.nodes.findOneAsync({ node_id, user_id });
                let result;
                if (exist && exist.node_id) {
                    if (!exist.sync_id)
                        row.sync_id = (0, generateSyncId_1.default)(5);
                    result = yield nedb_1.nodes.updateAsync({ node_id, user_id }, { $set: row });
                }
                else {
                    const sync_id = (0, generateSyncId_1.default)(5);
                    result = yield nedb_1.nodes.insertAsync(Object.assign(Object.assign({}, row), { sync_id }));
                }
                return result;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i = 0; i < nodes.length; i++) {
                    yield insert(nodes[i]);
                }
                (0, state_1.emit)("nodes-db", constants_1.STATES.RELOAD); // downgrade state to reload database
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        }));
    },
    /**
     *
     * @param node_id
     * @param ip
     */
    setNodePublicIPv4(node_id, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.nodes.updateAsync({ node_id }, { $set: { public_ipv4: ip } });
        });
    },
    /**
     * @todo delete _id
     */
    sync(data, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const row of data) {
                    const { sync_id, user_id, node_id } = row;
                    if (!sync_id) {
                        logger_1.default.debug("node", "sync", "unknown sync_id", sync_id);
                        continue;
                    }
                    yield nedb_1.nodes.updateAsync({ $or: [{ $and: [{ user_id }, { node_id }] }, { sync_id }] }, row, { upsert: true });
                }
                (0, state_1.emit)("nodes-db", constants_1.STATES.RELOAD); // downgrade state to reload database
                sync_1.default.confirm("nodes", from);
                return true;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     *
     * @param node_id
     * @returns
     */
    getSync(node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield sync_1.default.get("nodes", node_id);
                const time = updated && updated.time ? updated.time : 1;
                const nedbTime = new Date(time);
                return nedb_1.nodes.findAsync({
                    sync_id: { $exists: true },
                    updatedAt: { $gt: nedbTime },
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
};
exports.default = model;
