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
exports.checkHomeDir = exports.readProtocolTable = exports.readNodesTable = exports.readUsersTable = exports.readConfigTable = exports.store = void 0;
const nedb_1 = require("../components/nedb"); // edit // reorder
const node_fs_1 = __importDefault(require("node:fs")); // edit
const crypt = __importStar(require("./crypto"));
const state_1 = require("./state");
const logger_1 = __importDefault(require("./logger"));
const datadir_1 = require("../components/datadir");
const arguments_1 = __importDefault(require("../components/arguments"));
const constants_1 = require("../constants");
const generateMasterKeys_1 = __importDefault(require("./generateMasterKeys"));
const generateNodeKeys_1 = __importDefault(require("./generateNodeKeys"));
const createDataBase_1 = require("./createDataBase");
const model_1 = require("./model");
const keysDir = datadir_1.datadir + "/keys";
const _private = {
    router: 0,
};
/** @module Store */
/**
 * Default init store
 */
exports.store = {
    config: {
        get router() {
            return Number(arguments_1.default.port) || _private.router || constants_1.DEFAULTS.ROUTER;
        },
        set router(port) {
            _private.router = Number(arguments_1.default.port) || port; // edit // check order
        },
        bootstrap: 0,
        dhtLookup: 0,
        dhtAnnounce: 0,
        external: "",
        autoDefine: 0,
        public_ipv4: "",
    },
    ca: [],
    users: [],
    nodes: [],
    node: {
        name: constants_1.DEFAULTS.NODE_NAME,
        key: null,
        cert: null,
        id: "",
        public_ipv4: "",
    },
    user: {
        name: constants_1.DEFAULTS.USER_NAME,
        key: null,
        cert: null,
        id: "",
    },
};
/**
 *
 */
const getKeys = () => {
    if (!exports.store.user.key) {
        try {
            exports.store.user.key = node_fs_1.default.readFileSync(keysDir + "/key.pem");
            exports.store.user.cert = node_fs_1.default.readFileSync(keysDir + "/cert.pem");
            const id = crypt.getPublicCertHash(exports.store.user.cert.toString()); // edit
            if (id === undefined)
                throw "unknown cert"; // edit
            exports.store.user.id = id;
            (0, state_1.emit)("master-key", exports.store.user);
        }
        catch (e) {
            logger_1.default.log("store", "MASTER KEYS NOT FOUND");
            state_1.services.masterKey = constants_1.STATES.READY; // edit
        }
        /** @todo check result! */
        if (state_1.services.masterKey === constants_1.STATES.READY && arguments_1.default.auto)
            (0, generateMasterKeys_1.default)(exports.store, {
                name: arguments_1.default.master || constants_1.DEFAULTS.USER_NAME,
                keylength: 2048, // edit
            });
    }
    if (!exports.store.node.key) {
        try {
            exports.store.node.key = node_fs_1.default.readFileSync(keysDir + "/node-key.pem");
            exports.store.node.cert = node_fs_1.default.readFileSync(keysDir + "/node-cert.pem");
            const id = crypt.getPublicCertHash(exports.store.node.cert.toString());
            if (id === undefined)
                throw "unknown cert";
            exports.store.node.id = id;
            const names = crypt.getNamesFromNodeCert(exports.store.node.cert.toString());
            exports.store.user.name = names.user_name;
            exports.store.node.name = names.node_name;
            (0, state_1.emit)("node-key", exports.store.node);
        }
        catch (e) {
            logger_1.default.log("store", "NODE KEYS NOT FOUND");
            state_1.services.nodeKey = constants_1.STATES.READY; // edit
        }
        /** @todo check result! */
        if (state_1.services.nodeKey === constants_1.STATES.READY && arguments_1.default.auto)
            (0, generateNodeKeys_1.default)(exports.store, {
                name: arguments_1.default.node || constants_1.DEFAULTS.NODE_NAME,
                keylength: 2048,
            });
    }
};
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
            exports.store.config[element.param] = element.value;
            (0, state_1.emit)("config-" + element.param, element.value);
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
        exports.store.ca = caArray;
        exports.store.users = data;
        (0, state_1.emit)("users", data);
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
        exports.store.nodes = data;
        // const currentNode = store.nodes.find(node => node.node_id === store.node.id);
        // if (currentNode) {
        // 	store.node.public_ipv4 = currentNode.public_ipv4;
        // } else {
        // 	logger.warn("store", "OWN NODE NOT FOUND", store.node);
        // }
        (0, state_1.emit)("nodes", exports.store.nodes);
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
            (0, state_1.emit)("protocol-" + key, value);
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
(0, state_1.subscribe)(["master-key"], () => {
    state_1.services.masterKey = constants_1.STATES.FULL;
});
(0, state_1.subscribe)(["node-key"], () => {
    state_1.services.nodeKey = constants_1.STATES.FULL;
});
const defaults = {
    router: constants_1.DEFAULTS.ROUTER,
    bootstrap: constants_1.DHTPERM.ONLY_FRIENDS,
    dhtLookup: constants_1.DHTPERM.ONLY_FRIENDS,
    dhtAnnounce: constants_1.DHTPERM.ONLY_FRIENDS,
    external: constants_1.DEFAULTS.EXTERNAL,
    autoDefine: constants_1.DEFAULTS.AUTO_DEFINE_IP,
    public_ipv4: "",
};
(0, state_1.subscribe)(["master-key", "node-key", "config-db", "protocol-db"], (_action, _value, _type) => {
    if (state_1.state["config-db"] >= constants_1.STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state_1.state["protocol-db"] < constants_1.STATES.FULL)
        return;
    (0, exports.readConfigTable)()
        .then((_result) => {
        (0, state_1.emit)("config-db", constants_1.STATES.FULL);
    })
        .catch((err) => {
        if (arguments_1.default.auto) {
            logger_1.default.info("STORE", "Creating config table in automatic mode");
            (0, createDataBase_1.createConfigTable)(defaults);
        }
        else {
            (0, state_1.emit)("config-db", constants_1.STATES.ERROR); // check
            logger_1.default.log("store", "read config db error::", err);
        }
    });
});
(0, state_1.subscribe)(["master-key", "node-key", "users-db", "protocol-db"], (action, value, type) => {
    // check
    if (state_1.state["users-db"] >= constants_1.STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state_1.state["protocol-db"] < constants_1.STATES.FULL)
        return;
    (0, exports.readUsersTable)()
        .then((_result) => {
        (0, state_1.emit)("users-db", constants_1.STATES.FULL);
    })
        .catch((err) => {
        if (arguments_1.default.auto) {
            logger_1.default.info("STORE", "Creating users table in automatic mode");
            (0, createDataBase_1.createUsersTable)(exports.store);
        }
        else {
            (0, state_1.emit)("users-db", constants_1.STATES.ERROR); // check
            logger_1.default.log("store", "read users db error::", err);
        }
    });
});
(0, state_1.subscribe)(["master-key", "node-key", "nodes-db", "protocol-db"], (_action, status) => {
    if (state_1.state["nodes-db"] >= constants_1.STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state_1.state["protocol-db"] < constants_1.STATES.FULL)
        return;
    (0, exports.readNodesTable)()
        .then((result) => {
        (0, state_1.emit)("nodes-db", constants_1.STATES.FULL);
    })
        .catch((err) => {
        if (arguments_1.default.auto) {
            logger_1.default.info("STORE", "Creating nodes table in automatic mode");
            (0, createDataBase_1.createNodesTable)(exports.store, defaults);
        }
        else {
            (0, state_1.emit)("nodes-db", constants_1.STATES.ERROR); // check
            logger_1.default.log("store", "read nodes db error::", err);
        }
    });
});
(0, state_1.subscribe)(["config-db", "users-db", "nodes-db"], () => {
    const arr = [state_1.state["config-db"], state_1.state["users-db"], state_1.state["nodes-db"]];
    arr.sort((a, b) => {
        return a > b;
    });
    state_1.services.database = arr[0]; // min value
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
