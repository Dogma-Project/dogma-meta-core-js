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
const logger_1 = __importDefault(require("./logger"));
const state_1 = require("./state");
const model_1 = require("./model");
const store_1 = require("./store");
const constants_1 = require("../constants");
const sync = {
    handled: {
        messages: model_1.Message,
        users: model_1.User,
        nodes: model_1.Node,
    },
    state: [],
    /**
     *
     * @param {String} node_id
     * @param {String} type table name
     */
    get(node_id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const model = sync.handled[type];
                // logger.debug("sync", "get", type);
                if (model) {
                    const result = yield model.getSync(node_id);
                    // logger.debug("sync", "send result", result);
                    sync.request({
                        node_id,
                        action: "update",
                        data: {
                            type,
                            payload: result,
                        },
                    });
                }
                else {
                    logger_1.default.warn("sync", "unhandled type", type);
                }
            }
            catch (err) {
                logger_1.default.error("sync", "get", err);
            }
        });
    },
    update(node_id, type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // logger.debug("sync", "update", type, payload);
                const model = sync.handled[type];
                if (model && payload.length) {
                    yield model.sync(payload, node_id);
                }
            }
            catch (err) {
                logger_1.default.error("sync", "update", err);
            }
        });
    },
    /**
     *
     * @param {Object} params
     * @param {Object} params.node_id node hash
     * @param {String} params.action get, update
     * @param {Object} params.data optional
     */
    request({ node_id, action, data }) {
        const connection = require("./connection"); // temp
        connection.sendRequest(node_id, {
            type: "sync",
            action,
            data: data || {},
        }, constants_1.MESSAGES.DIRECT);
    },
    /**
     *
     * @param {Object} params
     * @param {String} params.node_id
     * @param {String} params.user_id
     * @param {Object} params.request
     * @param {String} params.request.action get, update
     * @param {Object} params.request.data
     * @param {String} params.request.data.type table name
     * @param {Array} params.request.data.payload
     */
    handleRequest({ node_id, user_id, request }) {
        if (store_1.store.user.id !== user_id)
            return logger_1.default.warn("sync", "handle request", "request from not own user");
        try {
            const { action, data: { type, payload }, } = request;
            switch (action) {
                case "get":
                    sync.get(node_id, type);
                    break;
                case "update":
                    sync.update(node_id, type, payload);
                    break;
            }
        }
        catch (err) {
            logger_1.default.error("sync", err);
        }
    },
};
// subscribe(["sync-db"], async (action, value, type) => {
//     if (value < STATES.LIMITED) {
//         const result = await Sync.getAll();
//         sync.state = result;
//         emit("sync-db", STATES.LIMITED);
//     } else if (value === STATES.LIMITED) {
//     } else if (value === STATES.FULL) {
//     }
// });
(0, state_1.subscribe)(["online"], (_action, value, _type) => {
    const { node_id, own, mySelf } = value;
    if (own && !mySelf) {
        for (const key in sync.handled) {
            sync.request({
                node_id,
                action: "get",
                data: {
                    type: key,
                },
            });
        }
    }
});
(0, state_1.subscribe)(["nodes", "users"], (_action, _value, type) => __awaiter(void 0, void 0, void 0, function* () {
    // logger.debug("sync", "resync", action, type);
    const nodes = yield model_1.Connection.getUserOnlineNodes(store_1.store.user.id);
    nodes.forEach((node_id) => {
        if (node_id === store_1.store.node.id)
            return; // don't send to yourself
        sync.get(node_id, type);
    });
}));
(0, state_1.subscribe)(["new-message"], (_action, value, _type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logger.debug("sync", "resync", action, type);
        const nodes = yield model_1.Connection.getUserOnlineNodes(store_1.store.user.id);
        nodes.forEach((node_id) => {
            if (node_id === store_1.store.node.id)
                return; // don't send to yourself
            sync.request({
                node_id,
                action: "update",
                data: {
                    type: "messages",
                    payload: [value],
                },
            });
        });
    }
    catch (err) {
        logger_1.default.error("sync", "broadcastUpdate", err);
    }
}));
exports.default = sync;
