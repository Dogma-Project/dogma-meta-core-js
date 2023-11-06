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
const constants_1 = require("../constants");
/**
 * @todo add online event
 */
class DogmaSocket extends node_events_1.default {
    constructor(socket, direction, state, storage) {
        super();
        this.status = 0 /* Types.Connection.Status.notConnected */;
        this.group = 0 /* Types.Connection.Group.unknown */;
        this.tested = false;
        this.socket = socket;
        this.id = (0, generateSyncId_1.default)(6);
        this.outSession = (0, generateSyncId_1.default)(12);
        this.direction = direction;
        this.stateBridge = state;
        this.storageBridge = storage;
        this.input = {
            handshake: new streams_1.MuxStream({ substream: 1 /* Types.Streams.MX.handshake */ }),
            test: new streams_1.MuxStream({ substream: 2 /* Types.Streams.MX.test */ }),
            control: new streams_1.MuxStream({ substream: 3 /* Types.Streams.MX.control */ }),
            messages: new streams_1.MuxStream({ substream: 4 /* Types.Streams.MX.messages */ }),
            mail: new streams_1.MuxStream({ substream: 5 /* Types.Streams.MX.mail */ }),
            dht: new streams_1.MuxStream({ substream: 6 /* Types.Streams.MX.dht */ }),
        };
        this.input.handshake.pipe(this.socket); // the one unencrypted substream
        this.socket.on("data", (data) => this._onData(data));
        this.socket.on("close", this._onClose);
        this.socket.on("error", this.onError);
        setTimeout(() => {
            this.sendHandshake(0 /* Types.Connection.Handshake.Stage.init */); // edit
        }, 50);
    }
    setEncryptor() {
        if (!this.publicNodeKey) {
            return; // edit
        }
        const encryptor = new streams_1.Encryption({ publicKey: this.publicNodeKey });
        this.input.test.pipe(encryptor).pipe(this.socket);
        this.input.control.pipe(encryptor).pipe(this.socket);
        this.input.messages.pipe(encryptor).pipe(this.socket);
        this.input.mail.pipe(encryptor).pipe(this.socket);
        this.input.dht.pipe(encryptor).pipe(this.socket);
    }
    _decrypt(chunk) {
        if (!this.storageBridge.node.privateKey) {
            return; // edit
        }
        const privateNodeKey = node_crypto_1.default.createPrivateKey({
            key: this.storageBridge.node.privateKey,
            type: "pkcs1",
            format: "pem",
        });
        const result = node_crypto_1.default.privateDecrypt(privateNodeKey, chunk);
        return result;
    }
    _demux(chunk) {
        const mx = chunk.subarray(0, constants_1.SIZES.MX).readUInt8(0);
        const data = chunk.subarray(constants_1.SIZES.MX, chunk.length);
        const result = {
            mx,
            data,
        };
        return result;
    }
    _onData(chunk) {
        const demuxed = this._demux(chunk);
        if (demuxed.mx > 1 /* Types.Streams.MX.handshake */) {
            const decrypted = this._decrypt(demuxed.data);
            if (!decrypted)
                return logger_1.default.warn("on data", "empty decrypted");
            demuxed.data = decrypted;
        }
        index_1.onData.call(this, demuxed);
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
    sendHandshake(stage) {
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
            const userSign = node_crypto_1.default.createSign("SHA256");
            userSign.update(this.storageBridge.user.publicKey);
            userSign.end();
            const nodeSign = node_crypto_1.default.createSign("SHA256");
            nodeSign.update(this.storageBridge.node.publicKey);
            nodeSign.end();
            const request = {
                stage,
                userKey: this.storageBridge.user.publicKey.toString(),
                userSign: userSign.sign(this.storageBridge.user.privateKey, "hex"),
                nodeKey: this.storageBridge.node.publicKey.toString(),
                nodeSign: nodeSign.sign(this.storageBridge.node.privateKey, "hex"),
            };
            this.input.handshake.write(JSON.stringify(request));
        }
    }
    /**
     *
     * @todo add verification
     */
    handleHandshake(data) {
        try {
            const json = data.toString();
            console.log("json", json);
            const parsed = JSON.parse(json);
            console.log("HS", parsed);
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
                    const verifyUser = node_crypto_1.default.createVerify("SHA256");
                    verifyUser.update(parsed.userKey);
                    verifyUser.end();
                    const verifyUserResult = verifyUser.verify(publicUserKey, parsed.userSign);
                    if (!verifyUserResult)
                        return logger_1.default.log("Socket", "User not verified", this.id);
                    const verifyNode = node_crypto_1.default.createVerify("SHA256");
                    verifyNode.update(parsed.userKey);
                    verifyNode.end();
                    const verifyNodeResult = verifyNode.verify(publicNodeKey, parsed.nodeSign);
                    if (!verifyNodeResult)
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
                    logger_1.default.log("Socker", this.id, "verified");
                    this.setEncryptor(); // if all's right
                }
                catch (err) {
                    logger_1.default.error("HS Verification", err);
                }
            }
        }
        catch (err) {
            logger_1.default.error("handle handshake", err);
        }
    }
    handleTest(data) {
        console.log("TEST", data);
    }
    destroy() {
        return this.socket.destroy();
    }
}
exports.default = DogmaSocket;
