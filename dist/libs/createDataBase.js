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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataBase = exports.createNodesTable = exports.createUsersTable = exports.createConfigTable = void 0;
const model_1 = require("./model");
const constants_1 = require("../constants");
/** @module CreateDataBase */
const createConfigTable = (defaults) => {
    return model_1.Protocol.persistProtocol(constants_1.PROTOCOL).then(() => {
        model_1.Config.persistConfig(defaults);
    }); // check
};
exports.createConfigTable = createConfigTable;
const createUsersTable = (store) => {
    const { id: user_id, name } = store.user;
    const query = {
        user_id,
        name,
    };
    return model_1.User.persistUser(query);
};
exports.createUsersTable = createUsersTable;
const createNodesTable = (store, defaults) => {
    const query = {
        name: store.node.name,
        node_id: store.node.id,
        user_id: store.user.id,
        public_ipv4: defaults.public_ipv4,
        router_port: defaults.router,
    };
    return model_1.Node.persistNodes([query]);
};
exports.createNodesTable = createNodesTable;
const createDataBase = (store, defaults) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, exports.createConfigTable)(defaults);
            yield (0, exports.createUsersTable)(store);
            yield (0, exports.createNodesTable)(store, defaults);
            resolve(1);
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.createDataBase = createDataBase;
