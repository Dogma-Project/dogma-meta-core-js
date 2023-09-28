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
// const logger = require("../../logger");
const { nodes: nodesDb, users: usersDb, connections: connectionsDb } = require("../nedb");
const model = module.exports = {
    /**
     *
     * @param {Object} params
     * @param {String} params.connection_id
     * @param {String} params.user_id
     * @param {String} params.node_id
     * @param {String} params.address
     * @param {Boolean} params.authorized
     * @returns {Promise}
     */
    push(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return connectionsDb.insertAsync(params);
        });
    },
    /**
     *
     * @param {String} connection_id
     */
    delete(connection_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return connectionsDb.removeAsync({ connection_id }, { multi: true });
        });
    },
    /**
     * @todo add exceptions for non-loaded data
     * @returns {Promise}
     */
    getConnections() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const online = yield connectionsDb.findAsync({});
                const nodesQuery = [];
                const usersQuery = [];
                online.forEach((row) => {
                    const { node_id, user_id } = row;
                    nodesQuery.push(node_id);
                    usersQuery.push(user_id);
                });
                const nodes = yield nodesDb.findAsync({ node_id: { $in: nodesQuery.unique() } });
                const users = yield usersDb.findAsync({ user_id: { $in: usersQuery.unique() } });
                const arr = [];
                online.forEach((connection) => {
                    const { node_id, user_id, authorized } = connection;
                    const nodeData = nodes.find(item => item.node_id === node_id);
                    const userData = users.find(item => item.user_id === user_id);
                    arr.push({
                        id: connection.connection_id,
                        address: connection.address,
                        user: {
                            user_id,
                            name: userData ? userData.name : user_id
                        },
                        node: {
                            node_id,
                            name: nodeData ? nodeData.name : node_id
                        },
                        authorized
                    });
                });
                resolve(arr);
            }
            catch (err) {
                reject(err);
            }
        }));
    },
    /**
     * @todo delete
     * @param {String} node_id
     */
    isNodeOnline(node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionsDb.findOneAsync({ node_id });
                return (result && result.connection_id);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     *
     * @param {String} address host:port
     * @param {String} node_id node hash
     * @return {Promise}
     */
    getConnectionsCount(address, node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionsDb.findAsync({ $or: [{ address }, { node_id }] });
                return result.length;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    /**
     *
     * @param {String} node_id node hash
     * @returns {Promise} object
     */
    getConnDataByNodeId(node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return connectionsDb.findOneAsync({ node_id });
        });
    },
    /**
     *
     * @param {String} user_id user hash
     * @returns {Promise} array of objects
     */
    getConnDataByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return connectionsDb.findAsync({ user_id });
        });
    },
    /**
     *
     * @param {String} user_id
     * @returns {Promise}
     */
    getUserOnlineNodes(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionsDb.findAsync({ user_id }).projection({ node_id: 1, _id: 0 });
                return result.map((item) => item.node_id);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
