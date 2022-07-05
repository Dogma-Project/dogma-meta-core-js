const { STATES } = require("../constants");
const { emit } = require("../state");
const { users: usersDb, nodes: nodesDb } = require("../nedb");
const generateSyncId = require("../generateSyncId");
const Sync = require("./sync");

const model = module.exports = {

    async getAll() {
        return usersDb.findAsync({});
    },

    /**
     * 
     * @param {Object} user 
     * @param {String} user.name
     * @param {String} user.user_id
     * @param {String} user.cert
     * @param {Number} user.type
     * @returns {Promise}
     */
    async persistUser(user) {
        try {
            const { user_id } = user;
            emit("update-user", user_id);
            const exist = await usersDb.findOneAsync({ user_id });
            const sync_id = generateSyncId(5);
            let result;
            if (exist && exist.user_id) {
                if (!exist.sync_id) user.sync_id = sync_id;
                result = await usersDb.updateAsync({ user_id }, { $set: user });
            } else {
                result = await usersDb.insertAsync({ ...user, sync_id });
            }
            emit("users-db", STATES.RELOAD); // downgrade state to reload database
            return result;
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * 
     * @param {String} user_id 
     * @todo set to deleted state instead of remove
     */
    async removeUser(user_id) {
        try {
            await usersDb.removeAsync({ user_id }, { multi: true });
            emit("users-db", STATES.RELOAD); // downgrade state to reload database
            await nodesDb.removeAsync({ user_id }, { multi: true });
            emit("nodes-db", STATES.RELOAD); // downgrade state to reload database
            return true;
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * 
     * @param {Array} data 
     * @param {String} from node_id
     */
    async sync(data, from) {
        try {
            for (const row of data) {
                const { _id, sync_id, user_id } = row;
                if (!sync_id) {
                    logger.debug("node", "sync", "unknown sync_id", _id);
                    continue;
                }
                delete row._id;
                await usersDb.updateAsync({ $or: [{ user_id }, { sync_id }] }, row, { upsert: true });
            }
            emit("users-db", STATES.RELOAD); // downgrade state to reload database
            Sync.confirm("users", from);
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
            const updated = await Sync.get("users", node_id);
            const time = updated && updated.time ? updated.time : 1;
            const nedbTime = new Date(time);
            return usersDb.findAsync({ sync_id: { $exists: true }, updatedAt: { $gt: nedbTime } });
        } catch (err) {
            return Promise.reject(err);
        }
    }

}