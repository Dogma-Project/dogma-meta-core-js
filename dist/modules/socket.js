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
const node_events_1 = __importDefault(require("node:events"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const Types = __importStar(require("../types"));
const generateSyncId_1 = __importDefault(require("./generateSyncId"));
const logger_1 = __importDefault(require("./logger"));
const streams_1 = require("./streams");
const index_1 = require("./socket/index");
/**
 * @todo add online event
 */
class DogmaSocket extends node_events_1.default {
    constructor(socket, direction, state) {
        super();
        this.status = Types.Connection.Status.notConnected;
        this.group = Types.Connection.Group.unknown;
        this.tested = false;
        this._onData = index_1.onData;
        this.socket = socket;
        this.id = (0, generateSyncId_1.default)(6);
        this.outSession = (0, generateSyncId_1.default)(12);
        this.user_id = null;
        this.node_id = null;
        this.direction = direction;
        this.stateBridge = state;
        this.input = {
            handshake: new streams_1.MuxStream({ substream: Types.Streams.MX.handshake }),
            test: new streams_1.MuxStream({ substream: Types.Streams.MX.test }),
            control: new streams_1.MuxStream({ substream: Types.Streams.MX.control }),
            messages: new streams_1.MuxStream({ substream: Types.Streams.MX.messages }),
            mail: new streams_1.MuxStream({ substream: Types.Streams.MX.mail }),
            dht: new streams_1.MuxStream({ substream: Types.Streams.MX.dht }),
        };
        this.output = new streams_1.DemuxStream({});
        this.setPipes();
        this.socket.on("close", this._onClose);
        this.socket.on("error", this.onError);
        this.output.on("data", this._onData);
    }
    setPipes() {
        // edit, just testing
        const keypair = node_crypto_1.default.generateKeyPairSync("rsa", {
            modulusLength: 2048,
        });
        const encryptor = new streams_1.Encryption({ publicKey: keypair.publicKey });
        const decryptor = new streams_1.Decryption({ privateKey: keypair.privateKey });
        this.input.handshake.pipe(encryptor).pipe(this.socket);
        this.input.test.pipe(encryptor).pipe(this.socket);
        this.input.control.pipe(encryptor).pipe(this.socket);
        this.input.messages.pipe(encryptor).pipe(this.socket);
        this.input.mail.pipe(encryptor).pipe(this.socket);
        this.input.dht.pipe(encryptor).pipe(this.socket);
        this.socket.pipe(decryptor).pipe(this.output);
    }
    _onClose(hadError) {
        return __awaiter(this, void 0, void 0, function* () {
            // edit
            this.emit("offline", this.node_id);
            // this._offline(node_id); // move to component
            logger_1.default.info("connection", "closed", this.id);
        });
    }
    onError(err) {
        logger_1.default.error("connection", this.id, err.name, err.message);
    }
    handleHandshake(data) {
        console.log("HS", data);
    }
    handleTest(data) {
        console.log("TEST", data);
    }
    destroy() {
        return this.socket.destroy();
    }
}
exports.default = DogmaSocket;
