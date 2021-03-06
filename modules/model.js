const nedb = require("./nedb");
const {emit} = require("./state");

class Model {

	/**
	 * 
	 * @param {Object} config { param1: value1, param2: value2... }
	 */
	persistConfig(config) {
		const insert = (row) => {
			return new Promise((resolve, reject) => {
				nedb.config.update({ param: row.param }, row, { upsert: true }, (err, result) => {
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
				emit("config-db", true);
				resolve(true);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * 
	 * @param {Object} user name, hash, cert, type
	 */
	persistUser(user) {
		return new Promise((resolve, reject) => {
			nedb.users.update({ hash: user.hash }, user, { upsert: true }, (err, result) => {
				if (err) return reject(err);
				emit("users-db", true);
				resolve(result);
			})
		});
	}

	/**
	 * 
	 * @param {Array} nodes
	 */
	 persistNodes(nodes) {
		const insert = (row) => {
			return new Promise((resolve, reject) => {
				nedb.nodes.update({ hash: row.hash, user_hash: row.user_hash }, row, { upsert: true }, (err, result) => {
					if (err) return reject(err);
					resolve(result);
				})
			});
		}

		return new Promise(async (resolve, reject) => {
			try {
				for (let i = 0; i < nodes.length; i++) {
					await insert(nodes[i]);
				}
				emit("nodes-db", true);
				resolve(true);
			} catch (err) {
				reject(err);
			}
		});
	}
}

var model = new Model;

module.exports = model;