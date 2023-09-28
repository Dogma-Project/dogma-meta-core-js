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
const nedb_1 = __importDefault(require("@seald-io/nedb"));
const { emit } = require("./state");
const logger = require("../logger");
const { datadir } = require("./datadir");
const { STATES } = require("./constants");
const dbDir = datadir + "/db";
logger.log("nedb", "HOMEDIR", dbDir);
const stores = {};
const indexHandler = (err) => {
    if (err)
        logger.error("nedb", "indexHandler error::", err);
};
stores.connections = new nedb_1.default({
    autoload: true,
});
stores.connections.ensureIndex({
    fieldName: "node_id",
    unique: true,
}, indexHandler);
stores.connections.ensureIndex({
    fieldName: "address",
    unique: true,
}, indexHandler);
// ------------------------ PERSIST -------------------------
stores.config = new nedb_1.default({
    filename: dbDir + "/config.db",
});
stores.users = new nedb_1.default({
    // sync
    filename: dbDir + "/users.db",
    timestampData: true,
});
stores.nodes = new nedb_1.default({
    // sync
    filename: dbDir + "/nodes.db",
    timestampData: true,
});
stores.messages = new nedb_1.default({
    // sync
    filename: dbDir + "/messages.db",
    timestampData: true,
});
stores.fileTransfer = new nedb_1.default({
    filename: dbDir + "/transfer.db",
    timestampData: true,
});
stores.sync = new nedb_1.default({
    filename: dbDir + "/sync.db",
});
stores.dht = new nedb_1.default({
    filename: dbDir + "/dht.db",
    timestampData: true,
});
stores.protocol = new nedb_1.default({
    filename: dbDir + "/protocol.db",
});
/**
 * @returns {Promise}
 */
stores.initPersistDbs = () => __awaiter(void 0, void 0, void 0, function* () {
    logger.log("nedb", "load databases...");
    try {
        yield stores.protocol.loadDatabaseAsync();
        logger.debug("nedb", "load database", "protocol");
        stores.protocol.ensureIndex({ fieldName: "name", unique: true }, indexHandler);
        emit("protocol-db", STATES.READY);
        yield stores.config.loadDatabaseAsync();
        logger.debug("nedb", "load database", "config");
        stores.config.ensureIndex({ fieldName: "param", unique: true }, indexHandler);
        emit("config-db", STATES.READY);
        yield stores.users.loadDatabaseAsync();
        logger.debug("nedb", "load database", "users");
        emit("users-db", STATES.READY);
        yield stores.nodes.loadDatabaseAsync();
        logger.debug("nedb", "load database", "nodes");
        emit("nodes-db", STATES.READY);
        yield stores.dht.loadDatabaseAsync();
        logger.debug("nedb", "load database", "dht");
        stores.dht.ensureIndex({ fieldName: "updatedAt", expireAfterSeconds: 3600 }, indexHandler);
        emit("dht-db", STATES.READY);
        yield stores.messages.loadDatabaseAsync();
        logger.debug("nedb", "load database", "messages");
        stores.messages.ensureIndex({ fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 }, indexHandler);
        yield stores.fileTransfer.loadDatabaseAsync();
        logger.debug("nedb", "load database", "fileTransfer");
        stores.fileTransfer.ensureIndex({ fieldName: "createdAt", expireAfterSeconds: 3600 * 24 * 30 }, indexHandler);
        yield stores.sync.loadDatabaseAsync();
        logger.debug("nedb", "load database", "sync");
        emit("sync-db", STATES.READY);
        return Promise.resolve(true);
    }
    catch (err) {
        return Promise.reject(err);
    }
});
module.exports = stores;
