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
exports.initPersistDbs = exports.protocol = exports.dht = exports.sync = exports.fileTransfer = exports.messages = exports.nodes = exports.users = exports.config = exports.connections = void 0;
const nedb_1 = __importDefault(require("@seald-io/nedb"));
const logger_1 = __importDefault(require("../libs/logger"));
const state_1 = require("../libs/state");
const datadir_1 = require("./datadir");
const constants_1 = require("../constants");
const dbDir = datadir_1.datadir + "/db";
logger_1.default.log("nedb", "HOMEDIR", dbDir);
const indexHandler = (err) => {
    if (err)
        logger_1.default.error("nedb", "indexHandler error::", err);
};
const connections = new nedb_1.default({
    autoload: true,
});
exports.connections = connections;
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
exports.config = config;
const users = new nedb_1.default({
    // sync
    filename: dbDir + "/users.db",
    timestampData: true,
});
exports.users = users;
const nodes = new nedb_1.default({
    // sync
    filename: dbDir + "/nodes.db",
    timestampData: true,
});
exports.nodes = nodes;
const messages = new nedb_1.default({
    // sync
    filename: dbDir + "/messages.db",
    timestampData: true,
});
exports.messages = messages;
const fileTransfer = new nedb_1.default({
    filename: dbDir + "/transfer.db",
    timestampData: true,
});
exports.fileTransfer = fileTransfer;
const sync = new nedb_1.default({
    filename: dbDir + "/sync.db",
});
exports.sync = sync;
const dht = new nedb_1.default({
    filename: dbDir + "/dht.db",
    timestampData: true,
});
exports.dht = dht;
const protocol = new nedb_1.default({
    filename: dbDir + "/protocol.db",
});
exports.protocol = protocol;
/**
 * @returns {Promise}
 */
const initPersistDbs = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.log("nedb", "load databases...");
    try {
        yield protocol.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "protocol");
        protocol.ensureIndex({ fieldName: "name", unique: true }, indexHandler);
        (0, state_1.emit)("protocol-db", constants_1.STATES.READY);
        yield config.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "config");
        config.ensureIndex({ fieldName: "param", unique: true }, indexHandler);
        (0, state_1.emit)("config-db", constants_1.STATES.READY);
        yield users.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "users");
        (0, state_1.emit)("users-db", constants_1.STATES.READY);
        yield nodes.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "nodes");
        (0, state_1.emit)("nodes-db", constants_1.STATES.READY);
        yield dht.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "dht");
        dht.ensureIndex({ fieldName: "updatedAt", expireAfterSeconds: 3600 }, indexHandler);
        (0, state_1.emit)("dht-db", constants_1.STATES.READY);
        yield messages.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "messages");
        messages.ensureIndex({ fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 }, indexHandler);
        yield fileTransfer.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "fileTransfer");
        fileTransfer.ensureIndex({ fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 }, indexHandler);
        yield sync.loadDatabaseAsync();
        logger_1.default.debug("nedb", "load database", "sync");
        (0, state_1.emit)("sync-db", constants_1.STATES.READY);
        return Promise.resolve(true);
    }
    catch (err) {
        return Promise.reject(err);
    }
});
exports.initPersistDbs = initPersistDbs;
