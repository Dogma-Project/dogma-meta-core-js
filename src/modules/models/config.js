const { STATES } = require("../constants");
const { emit } = require("../state");
const { config: configDb } = require("../nedb");

const model = module.exports = {

    async getAll() {
        return configDb.findAsync({});
    },

    /**
     * 
     * @param {Object} config { param1: value1, param2: value2... }
     * @returns {Promise}
     */
    persistConfig(config) {

        const insert = (row) => {
            return new Promise((resolve, reject) => {
                configDb.update({ param: row.param }, row, { upsert: true }, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                })
            });
        }

        const newObject = Object.keys(config).map((key) => {
            return {
                param: key,
                value: config[key]
            }
        });

        return new Promise(async (resolve, reject) => {
            try {
                for (const entry of newObject) await insert(entry);
                emit("config-db", STATES.RELOAD); // downgrade state to reload database
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });

    },


}