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
const { fileTransfer: fileTransferDb } = require("../nedb");
const model = module.exports = {
    /**
     *
     * @param {Object} params
     * @param {String} params.user_id
     * @param {Object} params.file file description
     * @param {String} params.file.descriptor
     * @param {Number} params.file.size
     * @param {String} params.file.pathname
     */
    permitFileTransfer({ user_id, file }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descriptor, size, pathname } = file;
            return fileTransferDb.updateAsync({
                user_id,
                descriptor
            }, {
                $set: {
                    user_id,
                    descriptor,
                    size,
                    pathname
                }
            }, {
                upsert: true
            });
        });
    },
    /**
     *
     * @param {Object} params
     * @param {String} params.user_id
     * @param {Number} params.descriptor
     */
    forbidFileTransfer({ user_id, descriptor }) {
        return __awaiter(this, void 0, void 0, function* () {
            return fileTransferDb.removeAsync({ user_id, descriptor }, { multi: true });
        });
    },
    /**
     *
     * @param {Object} params
     * @param {String} params.user_id
     * @param {Number} params.descriptor
     */
    fileTransferAllowed({ user_id, descriptor }) {
        return __awaiter(this, void 0, void 0, function* () {
            return fileTransferDb.findOneAsync({ user_id, descriptor });
        });
    }
};
