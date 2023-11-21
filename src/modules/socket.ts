import net from "node:net";
import crypto from "node:crypto";
import EventEmitter from "node:events";

import * as Types from "../types";
import generateSyncId from "./generateSyncId";
import logger from "./logger";
import { Decoder, Encoder } from "./streams";
import { onData } from "./socket/index";
import StateManager from "./state";
import Storage from "./storage";

class DogmaSocket extends EventEmitter {
  protected stateBridge: StateManager;
  protected storageBridge: Storage;

  public readonly id: Types.Connection.Id;
  private readonly socket: net.Socket;

  public input: {
    handshake: Encoder;
    test?: Encoder;
    control?: Encoder;
    messages?: Encoder;
    mail?: Encoder;
    dht?: Encoder;
  };

  public readonly direction: Types.Connection.Direction;
  status: Types.Connection.Status = Types.Connection.Status.notConnected;
  group: Types.Connection.Group = Types.Connection.Group.unknown;

  private outSession: string;
  private inSession?: string;

  private publicUserKey?: crypto.KeyObject;
  private publicNodeKey?: crypto.KeyObject;
  public user_id?: Types.User.Id;
  public node_id?: Types.Node.Id;
  public unverified_user_id?: Types.User.Id;
  public unverified_node_id?: Types.Node.Id;
  onDisconnect?: Function; // edit

  public tested: boolean = false;

  constructor(
    socket: net.Socket,
    direction: Types.Connection.Direction,
    state: StateManager,
    storage: Storage
  ) {
    super();
    this.id = generateSyncId(6);
    this.outSession = generateSyncId(12);
    this.direction = direction;
    this.stateBridge = state;
    this.storageBridge = storage;

    this.socket = socket;
    this.socket.on("close", this._onClose);
    this.socket.on("error", this._onError);
    this.input = {
      handshake: new Encoder({
        id: Types.Streams.MX.handshake,
      }),
    };
    this.input.handshake.pipe(this.socket); // unencrypted
    this.status = Types.Connection.Status.connected;
    this._setDecoder();
    this._sendHandshake(Types.Connection.Handshake.Stage.init);
  }

  private _setDecoder() {
    if (!this.storageBridge.node.privateKey) return; // edit
    const privateNodeKey = crypto.createPrivateKey({
      key: this.storageBridge.node.privateKey,
      type: "pkcs1",
      format: "pem",
    });
    const decoder = new Decoder(privateNodeKey);
    decoder.on("data", (data) => this._onData(data));
    this.socket.on("data", (data) => decoder.decode(data));
  }

  private _setEncoder() {
    this.input.test = new Encoder({
      id: Types.Streams.MX.test,
      publicKey: this.publicNodeKey,
    });
    this.input.test.pipe(this.socket);

    this.input.control = new Encoder({
      id: Types.Streams.MX.control,
      publicKey: this.publicNodeKey,
    });
    this.input.control.pipe(this.socket);

    this.input.messages = new Encoder({
      id: Types.Streams.MX.messages,
      publicKey: this.publicNodeKey,
    });
    this.input.messages.pipe(this.socket);

    this.input.mail = new Encoder({
      id: Types.Streams.MX.mail,
      publicKey: this.publicNodeKey,
    });
    this.input.mail.pipe(this.socket);

    this.input.dht = new Encoder({
      id: Types.Streams.MX.dht,
      publicKey: this.publicNodeKey,
    });
    this.input.dht.pipe(this.socket);
  }

  private _setGroup() {
    if (!this.user_id) return; // edit
    if (!this.node_id) return; // edit
    if (this.user_id === this.storageBridge.user.id) {
      // own user
      if (this.node_id === this.storageBridge.node.id) {
        // own node
        this.group = Types.Connection.Group.selfNode;
      } else {
        this.group = Types.Connection.Group.selfUser;
      }
    } else {
      const users = this.stateBridge.state[Types.Event.Type.users] as
        | Types.User.Model[]
        | undefined;
      if (!users || !Array.isArray(users)) return; // edit
      const inFriends = users.find((user) => user.user_id === this.user_id);
      if (inFriends) {
        this.group = Types.Connection.Group.friends;
      } else {
        this.group = Types.Connection.Group.all;
      }
    }
  }

  private _onData = onData;

  private _test() {
    this.input.test && this.input.test.write("ok");
  }

  private _onClose = async (hadError: boolean) => {
    // edit
    this.emit("offline", this.node_id);
    logger.info("connection", "closed", this.id);
  };

  private _onError = (err: Error) => {
    logger.error("connection", this.id, err.name, err.message);
  };

  private _sign(data: string, privateKey: crypto.KeyLike) {
    const signature = crypto.createSign("SHA256");
    signature.update(data);
    signature.end();
    return signature.sign(privateKey, "hex");
  }

  private _verify(data: string, publicKey: crypto.KeyLike, sign: string) {
    const verification = crypto.createVerify("SHA256");
    verification.update(data);
    verification.end();
    return verification.verify(publicKey, sign, "hex");
  }

  private _sendHandshake(stage: Types.Connection.Handshake.Stage) {
    if (!this.input) return logger.warn("Socket", "Input is not defined"); // edit
    if (!this.storageBridge.user.privateKey) return;
    if (!this.storageBridge.node.privateKey) return;
    if (!this.storageBridge.user.publicKey) return;
    if (!this.storageBridge.node.publicKey) return;
    if (!this.storageBridge.user.id) return;
    if (!this.storageBridge.node.id) return;

    if (stage === Types.Connection.Handshake.Stage.init) {
      const request: Types.Connection.Handshake.StageInitRequest = {
        stage,
        protocol: 1,
        session: this.outSession,
        user_id: this.storageBridge.user.id,
        node_id: this.storageBridge.node.id,
      };
      this.input.handshake.write(JSON.stringify(request));
    } else if (stage === Types.Connection.Handshake.Stage.verification) {
      if (this.inSession === undefined)
        return logger.warn("Socket", "unknown inSession");

      const userSign = this._sign(
        this.inSession,
        this.storageBridge.user.privateKey
      );
      const nodeSign = this._sign(
        this.inSession,
        this.storageBridge.node.privateKey
      );

      const request: Types.Connection.Handshake.StageVerificationRequest = {
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
  protected handleHandshake(data: Buffer) {
    try {
      const json = data.toString();
      const parsed = JSON.parse(json) as
        | Types.Connection.Handshake.StageInitRequest
        | Types.Connection.Handshake.StageVerificationRequest;

      if (parsed.stage === undefined) return; // edit

      if (parsed.stage === Types.Connection.Handshake.Stage.init) {
        this.inSession = parsed.session;
        this.unverified_user_id = parsed.user_id;
        this.unverified_node_id = parsed.node_id;
        this._sendHandshake(Types.Connection.Handshake.Stage.verification);
      } else if (
        parsed.stage === Types.Connection.Handshake.Stage.verification
      ) {
        try {
          const publicUserKey = crypto.createPublicKey(parsed.userKey); // edit
          const publicNodeKey = crypto.createPublicKey(parsed.nodeKey); // edit

          const verifyUser = this._verify(
            this.outSession,
            publicUserKey,
            parsed.userSign
          );
          if (!verifyUser)
            return logger.log("Socket", "User not verified", this.id);

          const verifyNode = this._verify(
            this.outSession,
            publicNodeKey,
            parsed.nodeSign
          );

          if (!verifyNode)
            return logger.log("Socket", "Node not verified", this.id);

          this.publicUserKey = publicUserKey;
          this.publicNodeKey = publicNodeKey;

          const user_id = crypto.createHash("SHA256");
          user_id.update(parsed.userKey);
          this.user_id = user_id.digest("hex");
          if (this.unverified_user_id !== this.user_id) return; // edit ban

          const node_id = crypto.createHash("SHA256");
          node_id.update(parsed.nodeKey);
          this.node_id = node_id.digest("hex");
          if (this.unverified_node_id !== this.node_id) return; // edit ban

          logger.log("Socket", this.id, "verified");
          this._setEncoder();
          this._setGroup();
          this._test();
        } catch (err) {
          logger.error("HS Verification", err);
        }
      } else {
        logger.warn("Socket", "Unknown stage");
      }
    } catch (err) {
      logger.error("handle handshake", err);
    }
  }

  protected handleTest(data: Buffer) {
    this.tested = true;
    this.emit("online", this.node_id);
    logger.info("Socket", "Connection tested", this.id);
  }

  public destroy() {
    // edit
    return this.socket.destroy();
  }
}

export default DogmaSocket;
