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
    constructor(socket, direction, state, storage) {
        super();
        this.status = 0 /* Types.Connection.Status.notConnected */;
        this.group = 0 /* Types.Connection.Group.unknown */;
        this.tested = false;
        this._onData = index_1.onData;
        this.socket = socket;
        this.id = (0, generateSyncId_1.default)(6);
        this.outSession = (0, generateSyncId_1.default)(12);
        this.direction = direction;
        this.stateBridge = state;
        this.storageBridge = storage;
        // this.socket.on("data", (data) => this._onData(data));
        this.socket.on("close", this._onClose);
        this.socket.on("error", this.onError);
        this.input = {
            handshake: new streams_1.Encoder({
                id: 1 /* Types.Streams.MX.handshake */,
            }),
        };
        this.input.handshake.pipe(this.socket); // unencrypted
        this.setDecoder();
        setTimeout(() => {
            this.sendHandshake(0 /* Types.Connection.Handshake.Stage.init */); // edit
        }, 50);
    }
    setDecoder() {
        if (!this.storageBridge.node.privateKey)
            return; // edit
        const privateNodeKey = node_crypto_1.default.createPrivateKey({
            key: this.storageBridge.node.privateKey,
            type: "pkcs1",
            format: "pem",
        });
        const decoder = new streams_1.Decoder(privateNodeKey);
        decoder.on("data", (data) => this._onData(data));
        this.socket.on("data", (data) => decoder.decode(data));
    }
    setEncoder() {
        this.input.test = new streams_1.Encoder({
            id: 2 /* Types.Streams.MX.test */,
            publicKey: this.publicNodeKey,
        });
        this.input.test.pipe(this.socket);
        this.input.control = new streams_1.Encoder({
            id: 3 /* Types.Streams.MX.control */,
            publicKey: this.publicNodeKey,
        });
        this.input.control.pipe(this.socket);
        this.input.messages = new streams_1.Encoder({
            id: 4 /* Types.Streams.MX.messages */,
            publicKey: this.publicNodeKey,
        });
        this.input.messages.pipe(this.socket);
        this.input.mail = new streams_1.Encoder({
            id: 5 /* Types.Streams.MX.mail */,
            publicKey: this.publicNodeKey,
        });
        this.input.mail.pipe(this.socket);
        this.input.dht = new streams_1.Encoder({
            id: 6 /* Types.Streams.MX.dht */,
            publicKey: this.publicNodeKey,
        });
        this.input.dht.pipe(this.socket);
    }
    _test() {
        // edit
        this.input.test && this.input.test.write("okokok");
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
    _sign(data, privateKey) {
        const signature = node_crypto_1.default.createSign("SHA256");
        signature.update(data);
        signature.end();
        return signature.sign(privateKey, "hex");
    }
    _verify(data, publicKey, sign) {
        const verification = node_crypto_1.default.createVerify("SHA256");
        verification.update(data);
        verification.end();
        return verification.verify(publicKey, sign, "hex");
    }
    sendHandshake(stage) {
        if (!this.input)
            return logger_1.default.warn("Socket", "Input is not defined"); // edit
        if (!this.storageBridge.user.privateKey)
            return;
        if (!this.storageBridge.node.privateKey)
            return;
        if (!this.storageBridge.user.publicKey)
            return;
        if (!this.storageBridge.node.publicKey)
            return;
        if (!this.storageBridge.user.id)
            return;
        if (!this.storageBridge.node.id)
            return;
        if (stage === 0 /* Types.Connection.Handshake.Stage.init */) {
            const request = {
                stage,
                protocol: 1,
                session: this.outSession,
                user_id: this.storageBridge.user.id,
                node_id: this.storageBridge.node.id,
            };
            this.input.handshake.write(JSON.stringify(request));
        }
        else if (stage === 1 /* Types.Connection.Handshake.Stage.verification */) {
            if (this.inSession === undefined)
                return logger_1.default.warn("Socket", "unknown inSession");
            const userSign = this._sign(this.inSession, this.storageBridge.user.privateKey);
            const nodeSign = this._sign(this.inSession, this.storageBridge.node.privateKey);
            const request = {
                stage,
                userKey: this.storageBridge.user.publicKey.toString(),
                userSign,
                nodeKey: this.storageBridge.node.publicKey.toString(),
                nodeSign,
            };
            this.input.handshake.write(JSON.stringify(request));
        }
    }
    /**
     *
     * @todo add data verification
     */
    handleHandshake(data) {
        try {
            const json = data.toString();
            const parsed = JSON.parse(json);
            if (parsed.stage === undefined)
                return; // edit
            if (parsed.stage === 0 /* Types.Connection.Handshake.Stage.init */) {
                this.inSession = parsed.session;
                this.unverified_user_id = parsed.user_id;
                this.unverified_node_id = parsed.node_id;
                setTimeout(() => {
                    this.sendHandshake(1 /* Types.Connection.Handshake.Stage.verification */);
                }, 50);
            }
            else if (parsed.stage === 1 /* Types.Connection.Handshake.Stage.verification */) {
                try {
                    const publicUserKey = node_crypto_1.default.createPublicKey(parsed.userKey); // edit
                    const publicNodeKey = node_crypto_1.default.createPublicKey(parsed.nodeKey); // edit
                    const verifyUser = this._verify(this.outSession, publicUserKey, parsed.userSign);
                    if (!verifyUser)
                        return logger_1.default.log("Socket", "User not verified", this.id);
                    const verifyNode = this._verify(this.outSession, publicNodeKey, parsed.nodeSign);
                    if (!verifyNode)
                        return logger_1.default.log("Socket", "Node not verified", this.id);
                    this.publicUserKey = publicUserKey;
                    this.publicNodeKey = publicNodeKey;
                    const user_id = node_crypto_1.default.createHash("SHA256");
                    user_id.update(parsed.userKey);
                    this.user_id = user_id.digest("hex");
                    if (this.unverified_user_id !== this.user_id)
                        return; // edit ban
                    const node_id = node_crypto_1.default.createHash("SHA256");
                    node_id.update(parsed.nodeKey);
                    this.node_id = node_id.digest("hex");
                    if (this.unverified_node_id !== this.node_id)
                        return; // edit ban
                    logger_1.default.log("Socket", this.id, "verified");
                    this.setEncoder();
                    setTimeout(() => {
                        this._test();
                    }, 50);
                }
                catch (err) {
                    logger_1.default.error("HS Verification", err);
                }
            }
            else {
                logger_1.default.warn("Socket", "Unknown stage");
            }
        }
        catch (err) {
            logger_1.default.error("handle handshake", err);
        }
    }
    handleTest(data) {
        this.tested = true;
    }
    destroy() {
        return this.socket.destroy();
    }
}
exports.default = DogmaSocket;
