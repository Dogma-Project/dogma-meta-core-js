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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeyPair = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const logger_1 = __importDefault(require("./logger"));
const node_fs_1 = __importDefault(require("node:fs"));
const datadir_1 = require("./datadir");
function _generateKeyPair(length) {
    const options = {
        modulusLength: length,
    };
    return new Promise((resolve, reject) => {
        node_crypto_1.default.generateKeyPair("rsa", options, (err, publicKey, privateKey) => {
            if (err)
                return reject(err);
            return resolve({ privateKey, publicKey });
        });
    });
}
function createKeyPair(type, length = 2048) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { publicKey, privateKey } = yield _generateKeyPair(length);
            const opts = {
                type: "pkcs1",
                format: "pem",
            };
            const publicKeyBuffer = publicKey.export(opts);
            const privateKeyBuffer = privateKey.export(opts);
            let private_str = "", public_str = "";
            if (type === 1 /* Keys.Type.masterKey */) {
                private_str = datadir_1.keysDir + "/master-private.pem";
                public_str = datadir_1.keysDir + "/master-public.pem";
            }
            else if (type === 0 /* Keys.Type.nodeKey */) {
                private_str = datadir_1.keysDir + "/node-private.pem";
                public_str = datadir_1.keysDir + "/node-public.pem";
            }
            else {
                return Promise.reject("unknown key type");
            }
            node_fs_1.default.writeFileSync(public_str, publicKeyBuffer);
            node_fs_1.default.writeFileSync(private_str, privateKeyBuffer);
            return Promise.resolve(true);
        }
        catch (err) {
            logger_1.default.error("keys", err);
            return Promise.reject(err);
        }
    });
}
exports.createKeyPair = createKeyPair;
