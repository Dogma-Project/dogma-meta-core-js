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
const { sync: syncDb } = require("../nedb");
const model = module.exports = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return syncDb.findAsync({});
        });
    },
    get(db, node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return syncDb.findOneAsync({ db, node_id });
        });
    },
    confirm(db, node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = new Date().getTime(); // check
            return syncDb.updateAsync({ db, node_id }, { db, node_id, time }, { upsert: true });
        });
    }
};
