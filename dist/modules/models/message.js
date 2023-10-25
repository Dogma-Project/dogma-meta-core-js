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
const datadir_1 = require("../datadir");
const nedb_1 = __importDefault(require("@seald-io/nedb"));
const logger_1 = __importDefault(require("../logger"));
const Types = __importStar(require("../../types"));
class MessageModel {
    constructor({ state }) {
        this.db = new nedb_1.default({
            filename: datadir_1.nedbDir + "/messages.db",
            timestampData: true,
        });
        this.stateBridge = state;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.debug("nedb", "load database", "messages");
                yield this.db.loadDatabaseAsync();
                yield this.db.ensureIndexAsync({
                    fieldName: "sync_id",
                    unique: true,
                });
                this.stateBridge.emit(Types.Event.Type.messagesDb, Types.System.States.ready);
            }
            catch (err) {
                logger_1.default.error("messages.nedb", err);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findAsync({});
        });
    }
    getAllByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            // edit type
            return this.db.findAsync({ type }).sort({ createdAt: 1 });
        });
    }
    get({ id, since, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            // edit types
            return this.db.findAsync({ type, id }).sort({ createdAt: 1 });
        });
    }
    getStatus({ id, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            // edit types
            try {
                // return messagesDb.findAsync({ type, id }).sort({ createdAt: -1 }).limit(1);
                const message = yield this.db
                    .findOneAsync({ type, id })
                    .sort({ createdAt: -1 });
                const text = message ? message.text || (message.files && "File") : "...";
                const from = message ? message.direction : null;
                return {
                    text,
                    from,
                    newMessages: 0,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    push(params) {
        return __awaiter(this, void 0, void 0, function* () {
            params.type = params.type || Types.Message.Type.direct;
            return this.db.insertAsync(params);
        });
    }
}
exports.default = MessageModel;
