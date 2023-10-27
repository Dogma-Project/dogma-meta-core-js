"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class Storage {
    constructor() {
        // config: Types.Config.Params = {
        //   router: Number(args.port) || DEFAULTS.ROUTER,
        //   bootstrap: Types.Connection.Group.unknown,
        //   dhtLookup: Types.Connection.Group.unknown,
        //   dhtAnnounce: Types.Connection.Group.unknown,
        //   autoDefine: Types.Constants.Boolean.false,
        //   external: "",
        //   public_ipv4: "",
        // };
        this.users = [];
        this.nodes = [];
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
