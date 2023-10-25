"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const generateSyncId_1 = __importDefault(require("../generateSyncId"));
const logger_1 = __importDefault(require("../logger"));
// import Sync from "./sync";
const Types = __importStar(require("../../types"));
const datadir_1 = require("../datadir");
const nedb_1 = __importDefault(require("@seald-io/nedb"));
class NodeModel {
    constructor({ state }) {
        this.db = new nedb_1.default({
            filename: datadir_1.nedbDir + "/nodes.db",
            timestampData: true,
        });
        this.stateBridge = state;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.debug("nedb", "load database", "nodes");
                yield this.db.loadDatabaseAsync();
                yield this.db.ensureIndexAsync({
                    fieldName: "param",
                    unique: true,
                });
                this.stateBridge.emit(7 /* Types.Event.Type.nodesDb */, 2 /* Types.System.States.ready */);
            }
            catch (err) {
                logger_1.default.error("config.nodes", err);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findAsync({});
        });
    }
    getByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findAsync({ user_id });
        });
    }
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
                const exist = yield this.db.findOneAsync({ node_id, user_id });
                let result;
                if (exist && exist.node_id) {
                    if (!exist.sync_id)
                        row.sync_id = (0, generateSyncId_1.default)(5);
                    result = yield this.db.updateAsync({ node_id, user_id }, { $set: row });
                }
                else {
                    const sync_id = (0, generateSyncId_1.default)(5);
                    result = yield this.db.insertAsync(Object.assign(Object.assign({}, row), { sync_id }));
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
                this.stateBridge.emit(7 /* Types.Event.Type.nodesDb */, 4 /* Types.System.States.reload */); // downgrade state to reload database
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    setNodePublicIPv4(node_id, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.updateAsync({ node_id }, { $set: { public_ipv4: ip } });
        });
    }
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
                    yield this.db.updateAsync({ $or: [{ $and: [{ user_id }, { node_id }] }, { sync_id }] }, row, { upsert: true });
                }
                this.stateBridge.emit(7 /* Types.Event.Type.nodesDb */, 4 /* Types.System.States.reload */); // downgrade state to reload database
                // Sync.confirm("nodes", from);
                return true;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
exports.default = NodeModel;
