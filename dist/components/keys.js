"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const state_1 = __importDefault(require("./state"));
const storage_1 = __importDefault(require("./storage"));
const datadir_1 = require("../modules/datadir");
const logger_1 = __importDefault(require("../modules/logger"));
const arguments_1 = __importDefault(require("../modules/arguments"));
const keys_1 = require("../modules/keys");
state_1.default.subscribe(["MASTER KEY" /* Event.Type.masterKey */], (payload) => {
    state_1.default.services.masterKey = payload;
    if (payload === 3 /* System.States.empty */) {
        logger_1.default.log("KEYS", "master key", "empty");
        if (arguments_1.default.auto) {
            (0, keys_1.createKeyPair)(1 /* Keys.Type.masterKey */, 4096)
                .then(() => {
                state_1.default.emit("MASTER KEY" /* Event.Type.masterKey */, 2 /* System.States.ready */);
            })
                .catch((err) => {
                state_1.default.emit("MASTER KEY" /* Event.Type.masterKey */, 0 /* System.States.error */);
                logger_1.default.error("keys:master", err);
            });
        }
    }
    else if (payload === 2 /* System.States.ready */) {
        logger_1.default.log("KEYS", "master key", "ready");
        try {
            storage_1.default.user.privateKey = node_fs_1.default.readFileSync(datadir_1.keysDir + "/master-private.pem");
            storage_1.default.user.publicKey = node_fs_1.default.readFileSync(datadir_1.keysDir + "/master-public.pem");
            state_1.default.emit("MASTER KEY" /* Event.Type.masterKey */, 7 /* System.States.full */);
        }
        catch (e) {
            logger_1.default.log("store", "MASTER KEYS NOT FOUND");
            state_1.default.emit("MASTER KEY" /* Event.Type.masterKey */, 3 /* System.States.empty */);
        }
    }
    else if (payload === 7 /* System.States.full */) {
        logger_1.default.log("KEYS", "master key", "loaded");
        if (storage_1.default.user.publicKey) {
            const hash = node_crypto_1.default.createHash("sha256");
            hash.update(storage_1.default.user.publicKey);
            storage_1.default.user.id = hash.digest("hex");
        }
    }
});
state_1.default.subscribe(["NODE KEY" /* Event.Type.nodeKey */], (payload) => {
    state_1.default.services.nodeKey = payload;
    if (payload === 3 /* System.States.empty */) {
        logger_1.default.log("KEYS", "node key", "empty");
        if (arguments_1.default.auto) {
            (0, keys_1.createKeyPair)(0 /* Keys.Type.nodeKey */, 2048)
                .then(() => {
                state_1.default.emit("NODE KEY" /* Event.Type.nodeKey */, 2 /* System.States.ready */);
            })
                .catch((err) => {
                state_1.default.emit("NODE KEY" /* Event.Type.nodeKey */, 0 /* System.States.error */);
                logger_1.default.error("keys:node", err);
            });
        }
    }
    else if (payload === 2 /* System.States.ready */) {
        logger_1.default.log("KEYS", "node key", "ready");
        try {
            storage_1.default.node.privateKey = node_fs_1.default.readFileSync(datadir_1.keysDir + "/node-private.pem");
            storage_1.default.node.publicKey = node_fs_1.default.readFileSync(datadir_1.keysDir + "/node-public.pem");
            state_1.default.emit("NODE KEY" /* Event.Type.nodeKey */, 7 /* System.States.full */);
        }
        catch (e) {
            logger_1.default.log("store", "NODE KEYS NOT FOUND");
            state_1.default.emit("NODE KEY" /* Event.Type.nodeKey */, 3 /* System.States.empty */);
        }
    }
    else if (payload === 7 /* System.States.full */) {
        logger_1.default.log("KEYS", "node key", "loaded");
        if (storage_1.default.node.publicKey) {
            const hash = node_crypto_1.default.createHash("sha256");
            hash.update(storage_1.default.node.publicKey);
            storage_1.default.node.id = hash.digest("hex");
        }
    }
});
state_1.default.subscribe(["START" /* Event.Type.start */, "HOME DIR" /* Event.Type.homeDir */], () => {
    logger_1.default.log("KEYS", "starting");
    state_1.default.emit("MASTER KEY" /* Event.Type.masterKey */, 2 /* System.States.ready */);
    state_1.default.emit("NODE KEY" /* Event.Type.nodeKey */, 2 /* System.States.ready */);
});
