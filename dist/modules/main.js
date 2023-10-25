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
exports.checkHomeDir = exports.readProtocolTable = exports.readNodesTable = exports.readUsersTable = exports.readConfigTable = void 0;
const nedb_1 = require("../components/nedb"); // edit // reorder
const node_fs_1 = __importDefault(require("node:fs")); // edit
const state_old_1 = require("./state-old");
const logger_1 = __importDefault(require("./logger"));
const datadir_1 = require("./datadir");
const arguments_1 = __importDefault(require("./arguments"));
const constants_1 = require("../constants");
const createDataBase_1 = require("./createDataBase");
const model_1 = require("./model");
const keysDir = datadir_1.datadir + "/keys";
/** @module Store */
/**
 *
 * @returns {Promise}
 */
const readConfigTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.Config.getAll();
        if (!data.length)
            return Promise.reject(0);
        data.forEach((element) => {
            store.config[element.param] = element.value;
            (0, state_old_1.emit)("config-" + element.param, element.value);
        });
        return data;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
exports.readConfigTable = readConfigTable;
/**
 *
 * @returns {Promise}
 */
const readUsersTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.User.getAll();
        if (!data.length)
            return Promise.reject(0);
        let caArray = [];
        data.forEach((user) => caArray.push(Buffer.from(user.cert))); // check exception
        store.ca = caArray;
        store.users = data;
        (0, state_old_1.emit)("users", data);
        return data;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
exports.readUsersTable = readUsersTable;
/**
 *
 * @returns {Promise}
 */
const readNodesTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.Node.getAll();
        if (!data.length)
            return Promise.reject(0);
        store.nodes = data;
        // const currentNode = store.nodes.find(node => node.node_id === store.node.id);
        // if (currentNode) {
        // 	store.node.public_ipv4 = currentNode.public_ipv4;
        // } else {
        // 	logger.warn("store", "OWN NODE NOT FOUND", store.node);
        // }
        (0, state_old_1.emit)("nodes", store.nodes);
        return data;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
exports.readNodesTable = readNodesTable;
/**
 * @returns {Promise}
 */
const readProtocolTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.Protocol.getAll();
        let protocol = {};
        for (const key in constants_1.PROTOCOL) {
            const item = data.find((obj) => obj.name === key);
            const value = !!item ? item.value || 0 : 0;
            protocol[key] = value;
            (0, state_old_1.emit)("protocol-" + key, value);
        }
        return protocol;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
exports.readProtocolTable = readProtocolTable;
/**
 *
 * @returns {Promise}
 */
const checkHomeDir = () => {
    // check and test
    return new Promise((resolve, reject) => {
        try {
            const dirs = ["keys", "db", "download", "temp"];
            if (!arguments_1.default.prefix && !node_fs_1.default.existsSync(datadir_1.datadir))
                node_fs_1.default.mkdirSync(datadir_1.datadir, { recursive: true });
            dirs.forEach((dir) => {
                const oldDir = datadir_1.dogmaDir + "/" + dir;
                const newDir = datadir_1.datadir + "/" + dir;
                if (!arguments_1.default.prefix && node_fs_1.default.existsSync(oldDir)) {
                    // if prefix not exist and there's a dirs in a root
                    node_fs_1.default.renameSync(oldDir, newDir);
                }
                else if (!node_fs_1.default.existsSync(newDir)) {
                    // if there's no data dir in prefixed space
                    node_fs_1.default.mkdirSync(newDir, { recursive: true });
                }
            });
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.checkHomeDir = checkHomeDir;
const defaults = {
    router: constants_1.DEFAULTS.ROUTER,
    bootstrap: DHTPERM.ONLY_FRIENDS,
    dhtLookup: DHTPERM.ONLY_FRIENDS,
    dhtAnnounce: DHTPERM.ONLY_FRIENDS,
    external: constants_1.DEFAULTS.EXTERNAL,
    autoDefine: constants_1.DEFAULTS.AUTO_DEFINE_IP,
    public_ipv4: "",
};
(0, state_old_1.subscribe)(["master-key", "node-key", "config-db", "protocol-db"], (_action, _value, _type) => {
    if (state_old_1.state["config-db"] >= STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state_old_1.state["protocol-db"] < STATES.FULL)
        return;
    (0, exports.readConfigTable)()
        .then((_result) => {
        (0, state_old_1.emit)("config-db", STATES.FULL);
    })
        .catch((err) => {
        if (arguments_1.default.auto) {
            logger_1.default.info("STORE", "Creating config table in automatic mode");
            (0, createDataBase_1.createConfigTable)(defaults);
        }
        else {
            (0, state_old_1.emit)("config-db", STATES.ERROR); // check
            logger_1.default.log("store", "read config db error::", err);
        }
    });
});
(0, state_old_1.subscribe)(["master-key", "node-key", "users-db", "protocol-db"], (action, value, type) => {
    // check
    if (state_old_1.state["users-db"] >= STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state_old_1.state["protocol-db"] < STATES.FULL)
        return;
    (0, exports.readUsersTable)()
        .then((_result) => {
        (0, state_old_1.emit)("users-db", STATES.FULL);
    })
        .catch((err) => {
        if (arguments_1.default.auto) {
            logger_1.default.info("STORE", "Creating users table in automatic mode");
            (0, createDataBase_1.createUsersTable)(store);
        }
        else {
            (0, state_old_1.emit)("users-db", STATES.ERROR); // check
            logger_1.default.log("store", "read users db error::", err);
        }
    });
});
(0, state_old_1.subscribe)(["master-key", "node-key", "nodes-db", "protocol-db"], (_action, status) => {
    if (state_old_1.state["nodes-db"] >= STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state_old_1.state["protocol-db"] < STATES.FULL)
        return;
    (0, exports.readNodesTable)()
        .then((result) => {
        (0, state_old_1.emit)("nodes-db", STATES.FULL);
    })
        .catch((err) => {
        if (arguments_1.default.auto) {
            logger_1.default.info("STORE", "Creating nodes table in automatic mode");
            (0, createDataBase_1.createNodesTable)(store, defaults);
        }
        else {
            (0, state_old_1.emit)("nodes-db", STATES.ERROR); // check
            logger_1.default.log("store", "read nodes db error::", err);
        }
    });
});
(0, state_old_1.subscribe)(["config-db", "users-db", "nodes-db"], () => {
    const arr = [state_old_1.state["config-db"], state_old_1.state["users-db"], state_old_1.state["nodes-db"]];
    arr.sort((a, b) => {
        return a > b;
    });
    state_old_1.services.database = arr[0]; // min value
});
// INIT POINT
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.checkHomeDir)();
        yield (0, nedb_1.initPersistDbs)();
        getKeys();
    }
    catch (err) {
        logger_1.default.error("store.js", "init", err);
    }
});
init();
