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
    async push(params) {
        return connectionsDb.insertAsync(params);
    },

    /**
     * 
     * @param {String} connection_id 
     */
    async delete(connection_id) {
        return connectionsDb.removeAsync({ connection_id }, { multi: true });
    },

    /**
     * @todo add exceptions for non-loaded data
     * @returns {Promise}
     */
    getConnections() {
        return new Promise(async (resolve, reject) => {
            try {
                const online = await connectionsDb.findAsync({});
                const nodesQuery = [];
                const usersQuery = [];
                online.forEach((row) => {
                    const { node_id, user_id } = row;
                    nodesQuery.push(node_id);
                    usersQuery.push(user_id);
                })
                const nodes = await nodesDb.findAsync({ node_id: { $in: nodesQuery.unique() } });
                const users = await usersDb.findAsync({ user_id: { $in: usersQuery.unique() } });
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
                    })
                });
                resolve(arr);
            } catch (err) {
                reject(err);
            }
        });
    },

    /**
     * @todo delete
     * @param {String} node_id 
     */
    async isNodeOnline(node_id) {
        try {
            const result = await connectionsDb.findOneAsync({ node_id });
            return (result && result.connection_id);
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * 
     * @param {String} address host:port
     * @param {String} node_id node hash
     * @return {Promise}
     */
    async getConnectionsCount(address, node_id) {
        try {
            const result = await connectionsDb.findAsync({ $or: [{ address }, { node_id }] });
            return result.length;
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * 
     * @param {String} node_id node hash
     * @returns {Promise} object
     */
    async getConnDataByNodeId(node_id) {
        return connectionsDb.findOneAsync({ node_id });
    },

    /**
     * 
     * @param {String} user_id user hash
     * @returns {Promise} array of objects
     */
    async getConnDataByUserId(user_id) {
        return connectionsDb.findAsync({ user_id });
    },

    /**
     * 
     * @param {String} user_id 
     * @returns {Promise}
     */
    async getUserOnlineNodes(user_id) {
        try {
            const result = await connectionsDb.findAsync({ user_id }).projection({ node_id: 1, _id: 0 });
            return result.map((item) => item.node_id);
        } catch (err) {
            return Promise.reject(err);
        }
    }

}