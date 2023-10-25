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
            return nedb_1.sync.findAsync({});
        });
    },
    get(db, node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.sync.findOneAsync({ db, node_id });
        });
    },
    confirm(db, node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = new Date().getTime(); // check
            return nedb_1.sync.updateAsync({ db, node_id }, { db, node_id, time }, { upsert: true });
        });
    },
};
module.exports = model;
exports.default = model;
