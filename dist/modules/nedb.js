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
exports.stores = exports.dht = void 0;
const nedb_1 = __importDefault(require("@seald-io/nedb"));
const logger_1 = __importDefault(require("../logger"));
const state_1 = require("./state");
const datadir_1 = require("./datadir");
const constants_1 = require("./constants");
const dbDir = datadir_1.datadir + "/db";
logger_1.default.log("nedb", "HOMEDIR", dbDir);
const indexHandler = (err) => {
    if (err)
        logger_1.default.error("nedb", "indexHandler error::", err);
};
const connections = new nedb_1.default({
    autoload: true,
});
connections.ensureIndex({
    fieldName: "node_id",
    unique: true,
}, indexHandler);
connections.ensureIndex({
    fieldName: "address",
    unique: true,
}, indexHandler);
// ------------------------ PERSIST -------------------------
const config = new nedb_1.default({
    filename: dbDir + "/config.db",
});
const users = new nedb_1.default({
    // sync
    filename: dbDir + "/users.db",
    timestampData: true,
});
const nodes = new nedb_1.default({
    // sync
    filename: dbDir + "/nodes.db",
    timestampData: true,
});
const messages = new nedb_1.default({
    // sync
    filename: dbDir + "/messages.db",
    timestampData: true,
});
const fileTransfer = new nedb_1.default({
    filename: dbDir + "/transfer.db",
    timestampData: true,
});
const sync = new nedb_1.default({
    filename: dbDir + "/sync.db",
});
exports.dht = new nedb_1.default({
    filename: dbDir + "/dht.db",
    timestampData: true,
});
const protocol = new nedb_1.default({
    filename: dbDir + "/protocol.db",
});
/**
 * @returns {Promise}
 */
const initPersistDbs = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.log("nedb", "load databases...");
    try {
        yield exports.stores.protocol.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "protocol");
        exports.stores.protocol.ensureIndex({ fieldName: "name", unique: true }, indexHandler);
        (0, state_1.emit)("protocol-db", constants_1.STATES.READY);
        yield exports.stores.config.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "config");
        exports.stores.config.ensureIndex({ fieldName: "param", unique: true }, indexHandler);
        (0, state_1.emit)("config-db", constants_1.STATES.READY);
        yield exports.stores.users.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "users");
        (0, state_1.emit)("users-db", constants_1.STATES.READY);
        yield exports.stores.nodes.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "nodes");
        (0, state_1.emit)("nodes-db", constants_1.STATES.READY);
        yield exports.stores.dht.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "dht");
        exports.stores.dht.ensureIndex({ fieldName: "updatedAt", expireAfterSeconds: 3600 }, indexHandler);
        (0, state_1.emit)("dht-db", constants_1.STATES.READY);
        yield exports.stores.messages.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "messages");
        exports.stores.messages.ensureIndex({ fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 }, indexHandler);
        yield exports.stores.fileTransfer.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "fileTransfer");
        exports.stores.fileTransfer.ensureIndex({ fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 }, indexHandler);
        yield exports.stores.sync.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "sync");
        (0, state_1.emit)("sync-db", constants_1.STATES.READY);
        return Promise.resolve(true);
    }
    catch (err) {
        return Promise.reject(err);
    }
});
exports.stores = {
    connections,
    config,
    users,
    nodes,
    messages,
    fileTransfer,
    sync,
    dht: exports.dht,
    protocol,
    initPersistDbs,
};
module.exports = exports.stores;
