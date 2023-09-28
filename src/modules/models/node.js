const { STATES } = require("../constants");
const { emit } = require("../state");
const { nodes: nodesDb } = require("../nedb");
const generateSyncId = require("../generateSyncId");
const logger = require("../../logger");
const Sync = require("./sync");

const model = module.exports = {

    async getAll() {
        return nodesDb.findAsync({});
    },

    /**
     * 
     * @param {String} user_id 
     * @returns {Promise}
     */
    async getByUserId(user_id) {
        return nodesDb.findAsync({ user_id });
    },

    /**
     * 
     * @param {Array} nodes [{name, node_id, user_id, public_ipv4, router_port}]
     * @returns {Promise}
     */
    persistNodes(nodes) { // add validation

        const insert = async (row) => {
            try {
                const { node_id, user_id } = row;
                if (!row.public_ipv4) delete row.public_ipv4;

                const exist = await nodesDb.findOne({ node_id, user_id });
                let result;
                if (exist && exist.node_id) {
                    if (!exist.sync_id) row.sync_id = generateSyncId(5);
                    result = await nodesDb.updateAsync({ node_id, user_id }, { $set: row });
                } else {
                    const sync_id = generateSyncId(5);
                    result = await nodesDb.insertAsync({ ...row, sync_id });
                }
                return result;
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return new Promise(async (resolve, reject) => {
            try {
                for (let i = 0; i < nodes.length; i++) {
                    await insert(nodes[i]);
                }
                emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });

    },

    /**
     * 
     * @param {String} node_id 
     * @param {String} ip 
     */
    async setNodePublicIPv4(node_id, ip) {
        return nodesDb.updateAsync({ node_id }, { $set: { public_ipv4: ip } });
    },

    /**
     * 
     * @param {Array} data 
     * @param {String} from node_id
     */
    async sync(data, from) {
        try {
            for (const row of data) {
                const { _id, sync_id, user_id, node_id } = row;
                if (!sync_id) {
                    logger.debug("node", "sync", "unknown sync_id", _id);
                    continue;
                }
                delete row._id;
                await nodesDb.updateAsync({ $or: [{ $and: [{ user_id }, { node_id }] }, { sync_id }] }, row, { upsert: true });
            }
            emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
            Sync.confirm("nodes", from);
            return true;
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * 
     * @param {String} node_id 
     * @returns 
     */
    async getSync(node_id) {
        try {
            const updated = await Sync.get("nodes", node_id);
            const time = updated && updated.time ? updated.time : 1;
            const nedbTime = new Date(time);
            return nodesDb.findAsync({ sync_id: { $exists: true }, updatedAt: { $gt: nedbTime } });
        } catch (err) {
            return Promise.reject(err);
        }
    }

}