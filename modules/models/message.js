const { messages: messagesDb } = require("../nedb");
const { MESSAGES } = require("../constants");
const Sync = require("./sync");

const model = module.exports = {

    /**
     * 
     * @param {Number} type 
     */
    async getAll(type) {
        return messagesDb.findAsync({ type }).sort({ createdAt: 1 });
    },

    /**
     * 
     * @param {Object} params 
     * @param {String} params.id
     * @param {Number} params.since timestamp (should implement)
     * @param {Number} params.type
     */
    async get({ id, since, type }) {
        return messagesDb.findAsync({ type, id }).sort({ createdAt: 1 });
    },


    /**
     * 
     * @param {Object} params 
     * @param {String} params.id
     * @param {Number} params.type
     * @returns {Promise}
     */
    async getStatus({ id, type }) {
        try {
            // return messagesDb.findAsync({ type, id }).sort({ createdAt: -1 }).limit(1);
            const message = await messagesDb.findOneAsync({ type, id }).sort({ createdAt: -1 });
            const text = message ? (message.text || (message.files && "File")) : "...";
            const from = message ? (message.direction) : null;
            return {
                text,
                from,
                newMessages: 0
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * 
     * @param {Object} params
     * @param {String} params.id
     * @param {String} params.message 
     * @param {String} params.sync_id
     * @param {Number} params.direction 
     * @param {Number} params.format 
     * @param {Number} params.type 
     */
    async push(params) {
        params.type = params.type || MESSAGES.DIRECT;
        return messagesDb.insertAsync(params);
    },

    /**
     * 
     * @param {Array} data 
     * @param {String} from node_id
     */
    async sync(data, from) {
        try {
            for (const row of data) {
                const { _id, sync_id } = row;
                if (!sync_id) {
                    logger.debug("node", "sync", "unknown sync_id", _id);
                    continue;
                }
                delete row._id;
                await messagesDb.updateAsync({ sync_id }, row, { upsert: true });
            }
            Sync.confirm("messages", from);
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
            const updated = await Sync.get("messages", node_id);
            const time = updated && updated.time ? updated.time : 1;
            const nedbTime = new Date(time);
            return messagesDb.findAsync({ sync_id: { $exists: true }, updatedAt: { $gt: nedbTime }, $not: { direction: MESSAGES.DIRECT } });
        } catch (err) {
            return Promise.reject(err);
        }
    }

}