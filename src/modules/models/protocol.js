const { protocol: protocolDb } = require("../nedb");

const model = module.exports = {

    async getAll() {
        return protocolDb.findAsync({});
    },

    /**
     * 
     * @param {Object} protocol { param1: value1, param2: value2... }
     * @returns {Promise}
     */
    persistProtocol(protocol) {

        const insert = (row) => {
            return new Promise((resolve, reject) => {
                const { name } = row;
                protocolDb.update({ name }, row, { upsert: true }, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                })
            });
        }

        const newObject = Object.keys(protocol).map((key) => {
            return {
                name: key,
                value: protocol[key]
            }
        });

        return new Promise(async (resolve, reject) => {
            try {
                for (const entry of newObject) await insert(entry);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });

    },

}