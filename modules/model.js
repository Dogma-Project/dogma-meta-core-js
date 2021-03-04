const db = require("./db");
const {emit} = require("./state");

class Model {

	/**
	 * 
	 * @param {String} table 
	 * @param {Object} data 
	 */
	persist(table, data) { // edit
		const insert = (obj) => {
			const keys = Object.keys(obj);
			const values = Object.values(obj);
			const count = values.map(() => {
				return "?";
			})
			const query = (`INSERT OR REPLACE INTO ${ table }(\`${ keys.join('\`, \`') }\`) VALUES (${ count.join(",") })`);
			return db.run(query, values);
		}

		return new Promise(async (resolve, reject) => { // check
			try {
				if (Array.isArray(data)) {
					for (const entry of data) await insert(entry);
				} else {
					await insert(data);
				}
				emit(`table-${table}`, data);
				resolve(true);
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	}

}

var model = new Model;

module.exports = model;