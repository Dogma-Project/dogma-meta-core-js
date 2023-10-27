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
const Types = __importStar(require("../../types"));
const datadir_1 = require("../datadir");
const nedb_1 = __importDefault(require("@seald-io/nedb"));
const logger_1 = __importDefault(require("../logger"));
class FileModel {
    constructor({ state }) {
        this.db = new nedb_1.default({
            filename: datadir_1.nedbDir + "/files.db",
        });
        this.stateBridge = state;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.debug("nedb", "load database", "files");
                yield this.db.loadDatabaseAsync();
                // await this.db.ensureIndexAsync({
                //   fieldName: "param",
                //   unique: true,
                // });
                this.stateBridge.emit(12 /* Types.Event.Type.filesDb */, 2 /* Types.System.States.ready */);
            }
            catch (err) {
                logger_1.default.error("files.nedb", err);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findAsync({});
        });
    }
    permitFileTransfer({ user_id, file, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descriptor, size, pathname } = file;
            return this.db.updateAsync({
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
    }
    forbidFileTransfer({ user_id, descriptor, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.removeAsync({ user_id, descriptor }, { multi: true });
        });
    }
    fileTransferAllowed({ user_id, descriptor, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findOneAsync({ user_id, descriptor });
        });
    }
}
exports.default = FileModel;
