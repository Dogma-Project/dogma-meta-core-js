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
    permitFileTransfer({ user_id, file, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descriptor, size, pathname } = file;
            return nedb_1.fileTransfer.updateAsync({
                user_id,
                descriptor,
            }, {
                $set: {
                    user_id,
                    descriptor,
                    size,
                    pathname,
                },
            }, {
                upsert: true,
            });
        });
    },
    forbidFileTransfer({ user_id, descriptor, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.fileTransfer.removeAsync({ user_id, descriptor }, { multi: true });
        });
    },
    fileTransferAllowed({ user_id, descriptor, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return nedb_1.fileTransfer.findOneAsync({ user_id, descriptor });
        });
    },
};
exports.default = model;
