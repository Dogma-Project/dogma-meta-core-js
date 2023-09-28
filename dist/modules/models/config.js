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
const { STATES } = require("../constants");
const { emit } = require("../state");
const { config: configDb } = require("../nedb");
const model = module.exports = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return configDb.findAsync({});
        });
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
                    if (err)
                        return reject(err);
                    resolve(result);
                });
            });
        };
        const newObject = Object.keys(config).map((key) => {
            return {
                param: key,
                value: config[key]
            };
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (const entry of newObject)
                    yield insert(entry);
                emit("config-db", STATES.RELOAD); // downgrade state to reload database
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        }));
    },
};
