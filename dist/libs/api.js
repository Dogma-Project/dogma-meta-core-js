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
const crypt = __importStar(require("./crypto"));
const createDataBase_1 = require("./createDataBase");
const store_1 = require("./store");
const generateMasterKeys_1 = __importDefault(require("./generateMasterKeys"));
const generateNodeKeys_1 = __importDefault(require("./generateNodeKeys"));
const state_1 = require("./state");
const constants_1 = require("../constants");
const files_1 = __importDefault(require("./controllers/files"));
const logger_1 = __importDefault(require("./logger"));
const connection = __importStar(require("./connection"));
const model_1 = require("./model");
/** @module GeneralApi */
/**
 *
 * @param {Number} code
 * @param {*} data
 */
const response = (code, data) => {
    code = Number(code) || 0;
    data = data || null;
    return {
        code,
        data,
    };
};
/**
 *
 * @param {Object} _store main store
 * @returns {Object}
 */
const getFriends = (_store) => __awaiter(void 0, void 0, void 0, function* () {
    // edit
    if (!_store || !_store.users || !_store.nodes)
        logger_1.default.warn("api", "empty store");
    let object = [];
    let usersKeys = {};
    object = store_1.store.users.map((user, i) => {
        delete user.cert;
        user.nodes = [];
        usersKeys[user.user_id] = i;
        return user;
    });
    _store.nodes.forEach((node) => {
        const uh = node.user_id;
        if (usersKeys[uh] !== undefined) {
            const i = usersKeys[uh];
            const online = connection.online.indexOf(node.node_id) > -1;
            object[i].nodes.push({
                name: node.name,
                node_id: node.node_id,
                online,
            });
        }
    });
    object = object.map((item) => {
        const online = item.nodes.filter((x) => !!x.online);
        item.onlineCount = online.length;
        return item;
    });
    for (let friend of object) {
        const { user_id } = friend;
        friend.messages = yield model_1.Message.getStatus({
            id: user_id,
            type: constants_1.MESSAGES.USER,
        });
    }
    return object;
});
module.exports.certificate = {
    /**
     * @returns {Object} result
     */
    get: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield crypt.getDogmaCertificate(store_1.store);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            logger_1.default.error("api certificate", "get 2", err);
            return response(constants_1.API.CANNOTGETCERT, err);
        }
    }),
    set: () => {
        logger_1.default.log("api certificate", "set", "nothing to do");
    },
    /**
     *
     * @param {String} cert b64
     * @returns {Object} result
     */
    push: (cert) => __awaiter(void 0, void 0, void 0, function* () {
        const parsed = crypt.validateDogmaCertificate(cert, store_1.store.user.id);
        if (parsed.result) {
            const result = yield crypt.addDogmaCertificate(parsed);
            if (result) {
                return response(constants_1.API.OK, result);
            }
            else {
                return response(constants_1.API.ADDCERTERROR); // add message
            }
        }
        else {
            return response(constants_1.API.INVALIDCERT, parsed.error);
        }
    }),
};
module.exports.database = {
    get: () => { },
    /**
     *
     * @param {Object} store
     * @param {Object} defaults
     * @param {Number} defaults.router main node's port
     * @param {Number} defaults.bootstrap DHT server permission level
     * @param {Number} defaults.dhtLookup DHT lookup permission level
     * @param {Number} defaults.dhtAnnounce DHT announce permission level
     * @param {String} defaults.external
     * @param {Number} defaults.autoDefine
     * @param {String} defaults.public_ipv4
     * @param {Number} defaults.stun
     * @param {Number} defaults.turn
     * @returns {Object} result
     */
    set: (defaults) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield (0, createDataBase_1.createDataBase)(store_1.store, defaults);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            logger_1.default.error("API database", "set", err);
            return response(constants_1.API.CREATEDBERROR, err); // edit
        }
    }),
};
module.exports.config = {
    get: () => {
        try {
            const result = store_1.store.config;
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            logger_1.default.error("API config", "get", err);
            return response(constants_1.API.GETCONFIGERROR, err);
        }
    },
    /**
     *
     * @param {Object} data
     * @returns {Object} result
     */
    set: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield model_1.Config.persistConfig(data);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            logger_1.default.error("API config", "set", err);
            return response(constants_1.API.CONFIGSAVEERROR, err);
        }
    }),
};
module.exports.messages = {
    /**
     *
     * @param {Object} params
     * @param {String} params.id
     * @param {Number} params.since
     * @param {Number} params.type
     * @returns {Array}
     */
    get: (params) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield model_1.Message.get(params);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            return response(constants_1.API.CANNOTGETDM, err); // edit
        }
    }),
    /**
     *
     * @param {Object} data
     * @param {String} data.to
     * @param {Object} data.message id,text,files
     * @param {Number} data.type
     */
    push: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { to, message, type } = data;
            const result = yield connection.sendMessage(to, message, type);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            return response(constants_1.API.CANNOTPUSHMSG, err);
        }
    }),
};
module.exports.friends = {
    get: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield getFriends(store_1.store);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            return response(constants_1.API.CANNOTGETFRIENDS, err);
        }
    }),
    set: () => {
        logger_1.default.warn("api friends", "set", "do nothing");
    },
    /**
     *
     * @param {String} user_id
     */
    delete: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (store_1.store.user.id === user_id)
                return response(constants_1.API.CANNOTDELETEITSELF, user_id);
            const result = yield model_1.User.removeUser(user_id);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            return response(constants_1.API.CANNOTDELETEFRIEND, err);
        }
    }),
};
module.exports.masterKey = {
    get: () => { },
    /**
     *
     * @param {Object} params
     */
    set: (params) => {
        const result = (0, generateMasterKeys_1.default)(store_1.store, params);
        if (result.result) {
            return response(constants_1.API.OK);
        }
        else {
            return response(constants_1.API.CANNOTCREATEMK, result.error);
        }
    },
};
module.exports.nodeKey = {
    get: () => { },
    /**
     *
     * @param {Object} params
     */
    set: (params) => {
        const result = (0, generateNodeKeys_1.default)(store_1.store, params);
        if (result.result) {
            return response(constants_1.API.OK);
        }
        else {
            return response(constants_1.API.CANNOTCREATENK, result.error);
        }
    },
};
module.exports.services = {
    /**
     * @returns {Object}
     */
    get: () => {
        try {
            const result = JSON.parse(JSON.stringify(state_1.services));
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            logger_1.default.error("API services", "get", err);
            return response(constants_1.API.CANNOTGETSERVICES, err);
        }
    },
    set: () => { },
};
module.exports.files = {
    /**
     *
     * @param {Object} params to, type, request{type, action, [data]}
     */
    get: (params) => __awaiter(void 0, void 0, void 0, function* () {
        const { to, request, type, request: { data: { descriptor, title, size }, }, } = params;
        try {
            yield files_1.default.permitFileDownload({
                to,
                type,
                descriptor,
                title,
                size,
            });
            const result = yield connection.sendRequest(to, request, type);
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            return response(constants_1.API.OK, err); // edit
        }
    }),
    /**
     *
     * @param {Object} data ArrayBuffer
     * @returns {Object} response
     */
    push: (data) => {
        // deprecated
    },
    /**
     *
     * @param {Object} params
     */
    delete: (params) => {
        logger_1.default.debug("api files", "delete", params);
    },
};
module.exports.connections = {
    get: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield model_1.Connection.getConnections();
            return response(constants_1.API.OK, result);
        }
        catch (err) {
            logger_1.default.error("API connections", "get", err);
            return response(constants_1.API.CANNOTGETCONNECTIONS, err);
        }
    }),
    /**
     *
     * @param {String} id connection id
     */
    delete: (id) => { },
};
