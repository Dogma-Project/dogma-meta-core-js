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
const { nodes: nodesDb } = require("../nedb");
const generateSyncId = require("../generateSyncId");
const logger = require("../../logger");
const Sync = require("./sync");
const model = module.exports = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return nodesDb.findAsync({});
        });
    },
    /**
     *
     * @param {String} user_id
     * @returns {Promise}
     */
    getByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return nodesDb.findAsync({ user_id });
        });
    },
    /**
     *
     * @param {Array} nodes [{name, node_id, user_id, public_ipv4, router_port}]
     * @returns {Promise}
     */
    persistNodes(nodes) {
        const insert = (row) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { node_id, user_id } = row;
                if (!row.public_ipv4)
                    delete row.public_ipv4;
                const exist = yield nodesDb.findOne({ node_id, user_id });
                let result;
                if (exist && exist.node_id) {
                    if (!exist.sync_id)
                        row.sync_id = generateSyncId(5);
                    result = yield nodesDb.updateAsync({ node_id, user_id }, { $set: row });
                }
                else {
                    const sync_id = generateSyncId(5);
                    result = yield nodesDb.insertAsync(Object.assign(Object.assign({}, row), { sync_id }));
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
                emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        }));
    },
    /**
     *
     * @param {String} node_id
     * @param {String} ip
     */
    setNodePublicIPv4(node_id, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return nodesDb.updateAsync({ node_id }, { $set: { public_ipv4: ip } });
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
                    const { _id, sync_id, user_id, node_id } = row;
                    if (!sync_id) {
                        logger.debug("node", "sync", "unknown sync_id", _id);
                        continue;
                    }
                    delete row._id;
                    yield nodesDb.updateAsync({ $or: [{ $and: [{ user_id }, { node_id }] }, { sync_id }] }, row, { upsert: true });
                }
                emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
                Sync.confirm("nodes", from);
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
                const updated = yield Sync.get("nodes", node_id);
                const time = updated && updated.time ? updated.time : 1;
                const nedbTime = new Date(time);
                return nodesDb.findAsync({ sync_id: { $exists: true }, updatedAt: { $gt: nedbTime } });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
