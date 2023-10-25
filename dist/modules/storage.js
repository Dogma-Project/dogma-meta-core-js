"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Types = __importStar(require("../types"));
const arguments_1 = __importDefault(require("./arguments"));
const constants_1 = require("../constants");
class Storage {
    constructor() {
        this.config = {
            _router: 0,
            get router() {
                return Number(arguments_1.default.port) || this._router || constants_1.DEFAULTS.ROUTER;
            },
            set router(port) {
                this._router = Number(arguments_1.default.port) || port; // edit // check order
            },
            bootstrap: 0 /* Types.Connection.Group.unknown */,
            dhtLookup: 0 /* Types.Connection.Group.unknown */,
            dhtAnnounce: 0 /* Types.Connection.Group.unknown */,
            autoDefine: 0 /* Types.Constants.Boolean.false */,
            external: "",
            public_ipv4: "",
        };
        this.users = [];
        this.nodes = [];
        this.node = {
            name: constants_1.DEFAULTS.NODE_NAME,
            key: null,
            cert: null,
            id: "",
            public_ipv4: "",
        };
        this.user = {
            name: constants_1.DEFAULTS.USER_NAME,
            key: null,
            cert: null,
            id: "",
        };
    }
}
exports.default = Storage;
