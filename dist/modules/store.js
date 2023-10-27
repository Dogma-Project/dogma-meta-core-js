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
const { initPersistDbs } = require("./nedb"); // edit // reorder
const fs = require("fs"); // edit
const crypt = require("./crypt");
const { emit, subscribe, services, state } = require("./state");
const logger = require("../logger");
const { datadir, dogmaDir } = require("./datadir");
const args = require("./arguments");
const { DEFAULTS, DHTPERM, STATES, PROTOCOL } = require("./constants");
const generateMasterKeys = require("./routines/generateMasterKeys");
const generateNodeKeys = require("./routines/generateNodeKeys");
const { cconfig, cusers, cnodes } = require("./routines/createDataBase");
const { Config, User, Node, Protocol } = require("./model");
const keysDir = datadir + "/keys";
const _private = {};
/** @module Store */
/**
 * Default init store
 */
const store = {
    config: {
        get router() {
            return (Number(args.port) || Number(_private.router) || Number(DEFAULTS.ROUTER));
        },
        set router(port) {
            _private.router = Number(args.port) || Number(port);
        },
    },
    ca: [],
    users: [],
    nodes: [],
    node: {
        name: DEFAULTS.NODE_NAME,
        key: null,
        cert: null,
        id: null,
        public_ipv4: null,
    },
    user: {
        name: DEFAULTS.USER_NAME,
        key: null,
        cert: null,
        id: null,
    },
};
/**
 *
 */
const getKeys = () => {
    if (!store.user.key) {
        try {
            store.user.key = fs.readFileSync(keysDir + "/key.pem");
            store.user.cert = fs.readFileSync(keysDir + "/cert.pem");
            store.user.id = crypt.getPublicCertHash(store.user.cert);
            emit("master-key", store.user);
        }
        catch (e) {
            logger.log("store", "MASTER KEYS NOT FOUND");
            services.masterKey = STATES.READY; // edit
        }
        /** @todo check result! */
        if (services.masterKey === STATES.READY && args.auto)
            generateMasterKeys(store, {
                name: args.master || DEFAULTS.USER_NAME,
                length: 2048,
            });
    }
    if (!store.node.key) {
        try {
            store.node.key = fs.readFileSync(keysDir + "/node-key.pem");
            store.node.cert = fs.readFileSync(keysDir + "/node-cert.pem");
            store.node.id = crypt.getPublicCertHash(store.node.cert);
            const names = crypt.getNamesFromNodeCert(store.node.cert);
            store.user.name = names.user_name;
            store.node.name = names.node_name;
            emit("node-key", store.node);
        }
        catch (e) {
            logger.log("store", "NODE KEYS NOT FOUND");
            services.nodeKey = STATES.READY; // edit
        }
        /** @todo check result! */
        if (services.nodeKey === STATES.READY && args.auto)
            generateNodeKeys(store, {
                name: args.node || DEFAULTS.NODE_NAME,
                length: 2048,
            });
    }
};
/**
 *
 * @returns {Promise}
 */
const readConfigTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Config.getAll();
        if (!data.length)
            return Promise.reject(0);
        data.forEach((element) => {
            store.config[element.param] = element.value;
            emit("config-" + element.param, element.value);
        });
        return data;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
/**
 *
 * @returns {Promise}
 */
const readUsersTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User.getAll();
        if (!data.length)
            return Promise.reject(0);
        let caArray = [];
        data.forEach((user) => caArray.push(Buffer.from(user.cert))); // check exception
        store.ca = caArray;
        store.users = data;
        emit("users", data);
        return data;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
/**
 *
 * @returns {Promise}
 */
const readNodesTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Node.getAll();
        if (!data.length)
            return Promise.reject(0);
        store.nodes = data;
        // const currentNode = store.nodes.find(node => node.node_id === store.node.id);
        // if (currentNode) {
        // 	store.node.public_ipv4 = currentNode.public_ipv4;
        // } else {
        // 	logger.warn("store", "OWN NODE NOT FOUND", store.node);
        // }
        emit("nodes", store.nodes);
        return data;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
/**
 * @returns {Promise}
 */
const readProtocolTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Protocol.getAll();
        let protocol = {};
        for (const key in PROTOCOL) {
            const item = data.find((obj) => obj.name === key);
            const value = !!item ? item.value || 0 : 0;
            protocol[key] = value;
            emit("protocol-" + key, value);
        }
        return protocol;
    }
    catch (err) {
        return Promise.reject(err);
    }
});
/**
 *
 * @returns {Promise}
 */
const checkHomeDir = () => {
    // check and test
    return new Promise((resolve, reject) => {
        try {
            const dirs = ["keys", "db", "download", "temp"];
            if (!args.prefix && !fs.existsSync(datadir))
                fs.mkdirSync(datadir, { recursive: true });
            dirs.forEach((dir) => {
                const oldDir = dogmaDir + "/" + dir;
                const newDir = datadir + "/" + dir;
                if (!args.prefix && fs.existsSync(oldDir)) {
                    // if prefix not exist and there's a dirs in a root
                    fs.renameSync(oldDir, newDir);
                }
                else if (!fs.existsSync(newDir)) {
                    // if there's no data dir in prefixed space
                    fs.mkdirSync(newDir, { recursive: true });
                }
            });
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};
subscribe(["master-key"], () => {
    services.masterKey = STATES.FULL;
});
subscribe(["node-key"], () => {
    services.nodeKey = STATES.FULL;
});
const defaults = {
    router: DEFAULTS.ROUTER,
    bootstrap: DHTPERM.ONLY_FRIENDS,
    dhtLookup: DHTPERM.ONLY_FRIENDS,
    dhtAnnounce: DHTPERM.ONLY_FRIENDS,
    external: DEFAULTS.EXTERNAL,
    autoDefine: DEFAULTS.AUTO_DEFINE_IP,
    public_ipv4: "",
};
subscribe(["master-key", "node-key", "config-db", "protocol-db"], (_action, _value, _type) => {
    if (state["config-db"] >= STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state["protocol-db"] < STATES.FULL)
        return;
    readConfigTable()
        .then((_result) => {
        emit("config-db", STATES.FULL);
    })
        .catch((err) => {
        if (args.auto) {
            logger.info("STORE", "Creating config table in automatic mode");
            cconfig(defaults);
        }
        else {
            emit("config-db", STATES.ERROR); // check
            logger.log("store", "read config db error::", err);
        }
    });
});
subscribe(["master-key", "node-key", "users-db", "protocol-db"], (action, value, type) => {
    // check
    if (state["users-db"] >= STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state["protocol-db"] < STATES.FULL)
        return;
    readUsersTable()
        .then((_result) => {
        emit("users-db", STATES.FULL);
    })
        .catch((err) => {
        if (args.auto) {
            logger.info("STORE", "Creating users table in automatic mode");
            cusers(store);
        }
        else {
            emit("users-db", STATES.ERROR); // check
            logger.log("store", "read users db error::", err);
        }
    });
});
subscribe(["master-key", "node-key", "nodes-db", "protocol-db"], (_action, status) => {
    if (state["nodes-db"] >= STATES.LIMITED)
        return; // don't trigger when status is loaded
    if (state["protocol-db"] < STATES.FULL)
        return;
    readNodesTable()
        .then((result) => {
        emit("nodes-db", STATES.FULL);
    })
        .catch((err) => {
        if (args.auto) {
            logger.info("STORE", "Creating nodes table in automatic mode");
            cnodes(store, defaults);
        }
        else {
            emit("nodes-db", STATES.ERROR); // check
            logger.log("store", "read nodes db error::", err);
        }
    });
});
subscribe(["config-db", "users-db", "nodes-db"], () => {
    const arr = [state["config-db"], state["users-db"], state["nodes-db"]];
    arr.sort((a, b) => {
        return a > b;
    });
    services.database = arr[0]; // min value
});
// INIT POINT
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield checkHomeDir();
        yield initPersistDbs();
        getKeys();
    }
    catch (err) {
        logger.error("store.js", "init", err);
    }
});
init();
module.exports.store = store;
module.exports.rconfig = readConfigTable;
module.exports.rusers = readUsersTable;
module.exports.rnodes = readNodesTable;
module.exports.rprotocol = readProtocolTable;