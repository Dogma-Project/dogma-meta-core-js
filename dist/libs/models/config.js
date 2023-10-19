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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const state_1 = require("../state");
const nedb_1 = require("../nedb");
const model = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.config.findAsync({});
        });
    },
    persistConfig(config) {
        const insert = (row) => {
            return new Promise((resolve, reject) => {
                nedb_1.config.update({ param: row.param }, row, { upsert: true }, (err, result) => {
                    if (err)
                        return reject(err);
                    resolve(result);
                });
            });
        };
        const newObject = Object.keys(config).map((key) => {
            return {
                param: key,
                value: config[key],
            };
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (const entry of newObject)
                    yield insert(entry);
                (0, state_1.emit)("config-db", constants_1.STATES.RELOAD); // downgrade state to reload database
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        }));
    },
};
exports.default = model;
