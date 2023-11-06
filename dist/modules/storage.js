"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class Storage {
    constructor() {
        // users: Types.User.Model[] = [];
        // nodes: Types.Node.Model[] = [];
        this.node = {
            id: null,
            name: constants_1.DEFAULTS.NODE_NAME,
            privateKey: null,
            publicKey: null,
        };
        this.user = {
            id: null,
            name: constants_1.DEFAULTS.USER_NAME,
            privateKey: null,
            publicKey: null,
        };
    }
}
exports.default = Storage;
