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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("@seald-io/nedb"));
const Types = __importStar(require("../../types"));
const datadir_1 = require("../datadir");
const logger_1 = __importDefault(require("../logger"));
class DHTModel {
    constructor({ state }) {
        this.db = new nedb_1.default({
            filename: datadir_1.nedbDir + "/dht.db",
        });
        this.stateBridge = state;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.debug("nedb", "load database", "DHT");
                yield this.db.loadDatabaseAsync();
                // await this.db.ensureIndexAsync({
                //   fieldName: "param",
                //   unique: true,
                // });
                this.stateBridge.emit(11 /* Types.Event.Type.dhtDb */, 2 /* Types.System.States.ready */);
            }
            catch (err) {
                logger_1.default.error("dht.nedb", err);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findAsync({});
        });
    }
    get(params) {
        return this.db.findAsync(params);
    }
    checkOrInsert(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.db.countAsync(params);
                if (!count) {
                    const { user_id, node_id } = params;
                    yield this.db.updateAsync({ user_id, node_id }, params, {
                        upsert: true,
                    });
                    return 1 /* Types.DHT.Response.ok */;
                }
                else {
                    return 0 /* Types.DHT.Response.alreadyPresent */;
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
exports.default = DHTModel;
