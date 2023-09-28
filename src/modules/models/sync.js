const { sync: syncDb } = require("../nedb");

const model = module.exports = {

    async getAll() {
        return syncDb.findAsync({});
    },

    async get(db, node_id) {
        return syncDb.findOneAsync({ db, node_id });
    },

    async confirm(db, node_id) {
        const time = new Date().getTime(); // check
        return syncDb.updateAsync({ db, node_id }, { db, node_id, time }, { upsert: true });
    }
}