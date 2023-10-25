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
const nedb_1 = require("../nedb");
const model = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.protocol.findAsync({});
        });
    },
    persistProtocol(protocol) {
        const insert = (row) => {
            return new Promise((resolve, reject) => {
                const { name } = row;
                nedb_1.protocol.update({ name }, row, { upsert: true }, (err, result) => {
                    if (err)
                        return reject(err);
                    resolve(result);
                });
            });
        };
        const newObject = Object.keys(protocol).map((key) => {
            return {
                name: key,
                value: protocol[key],
            };
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (const entry of newObject)
                    yield insert(entry);
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        }));
    },
};
exports.default = model;
