import net from "node:net";
import EventEmitter from "node:events";

import crypto from "node:crypto";

import * as Types from "../types";
import generateSyncId from "./generateSyncId";
import logger from "./logger";
import { MuxStream, Encryption } from "./streams";
import { onData } from "./socket/index";
import StateManager from "./state";
import Storage from "./storage";
import { SIZES } from "../constants";

/**
 * @todo add online event
 */

class DogmaSocket extends EventEmitter {
  protected stateBridge: StateManager;
  protected storageBridge: Storage;

  public readonly id: Types.Connection.Id;
  private readonly socket: net.Socket;

  public input: {
    handshake: MuxStream;
    test: MuxStream;
    control: MuxStream;
    messages: MuxStream;
    mail: MuxStream;
    dht: MuxStream;
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
    this.socket = socket;
    this.id = generateSyncId(6);
    this.outSession = generateSyncId(12);
    this.direction = direction;
    this.stateBridge = state;
    this.storageBridge = storage;
    this.input = {
      handshake: new MuxStream({ substream: Types.Streams.MX.handshake }),
      test: new MuxStream({ substream: Types.Streams.MX.test }),
      control: new MuxStream({ substream: Types.Streams.MX.control }),
      messages: new MuxStream({ substream: Types.Streams.MX.messages }),
      mail: new MuxStream({ substream: Types.Streams.MX.mail }),
      dht: new MuxStream({ substream: Types.Streams.MX.dht }),
    };
    this.input.handshake.pipe(this.socket); // the one unencrypted substream
    this.socket.on("data", (data) => this._onData(data));
    this.socket.on("close", this._onClose);
    this.socket.on("error", this.onError);
    setTimeout(() => {
      this.sendHandshake(Types.Connection.Handshake.Stage.init); // edit
    }, 50);
  }

  private setEncryptor() {
    if (!this.publicNodeKey) {
      return; // edit
    }
    const encryptor = new Encryption({ publicKey: this.publicNodeKey });
    this.input.test.pipe(encryptor).pipe(this.socket);
    this.input.control.pipe(encryptor).pipe(this.socket);
    this.input.messages.pipe(encryptor).pipe(this.socket);
    this.input.mail.pipe(encryptor).pipe(this.socket);
    this.input.dht.pipe(encryptor).pipe(this.socket);
  }

  private _decrypt(chunk: Buffer) {
    if (!this.storageBridge.node.privateKey) {
      return; // edit
    }
    const privateNodeKey = crypto.createPrivateKey({
      key: this.storageBridge.node.privateKey,
      type: "pkcs1",
      format: "pem",
    });
    const result = crypto.privateDecrypt(privateNodeKey, chunk);
    return result;
  }

  private _demux(chunk: Buffer) {
    const mx = chunk.subarray(0, SIZES.MX).readUInt8(0);
    const data = chunk.subarray(SIZES.MX, chunk.length);
    const result: Types.Streams.DemuxedResult = {
      mx,
      data,
    };
    return result;
  }

  private _onData(chunk: Buffer) {
    const demuxed = this._demux(chunk);
    if (demuxed.mx > Types.Streams.MX.handshake) {
      const decrypted = this._decrypt(demuxed.data);
      if (!decrypted) return logger.warn("on data", "empty decrypted");
      demuxed.data = decrypted;
    }
    onData.call(this, demuxed);
  }

  private async _onClose(hadError: boolean) {
    // edit
    this.emit("offline", this.node_id);
    // this._offline(node_id); // move to component
    logger.info("connection", "closed", this.id);
  }

  private onError(err: Error) {
    logger.error("connection", this.id, err.name, err.message);
  }

  private sendHandshake(stage: Types.Connection.Handshake.Stage) {
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
      const userSign = crypto.createSign("SHA256");
      userSign.update(this.storageBridge.user.publicKey);
      userSign.end();
      const nodeSign = crypto.createSign("SHA256");
      nodeSign.update(this.storageBridge.node.publicKey);
      nodeSign.end();
      const request: Types.Connection.Handshake.StageVerificationRequest = {
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
  protected handleHandshake(data: Buffer) {
    try {
      const json = data.toString();
      console.log("json", json);
      const parsed = JSON.parse(json) as
        | Types.Connection.Handshake.StageInitRequest
        | Types.Connection.Handshake.StageVerificationRequest;
      console.log("HS", parsed);
      if (parsed.stage === undefined) return; // edit
      if (parsed.stage === Types.Connection.Handshake.Stage.init) {
        this.inSession = parsed.session;
        this.unverified_user_id = parsed.user_id;
        this.unverified_node_id = parsed.node_id;
        setTimeout(() => {
          this.sendHandshake(Types.Connection.Handshake.Stage.verification);
        }, 50);
      } else if (
        parsed.stage === Types.Connection.Handshake.Stage.verification
      ) {
        try {
          const publicUserKey = crypto.createPublicKey(parsed.userKey); // edit
          const publicNodeKey = crypto.createPublicKey(parsed.nodeKey); // edit

          const verifyUser = crypto.createVerify("SHA256");
          verifyUser.update(parsed.userKey);
          verifyUser.end();
          const verifyUserResult = verifyUser.verify(
            publicUserKey,
            parsed.userSign
          );
          if (!verifyUserResult)
            return logger.log("Socket", "User not verified", this.id);

          const verifyNode = crypto.createVerify("SHA256");
          verifyNode.update(parsed.userKey);
          verifyNode.end();
          const verifyNodeResult = verifyNode.verify(
            publicNodeKey,
            parsed.nodeSign
          );
          if (!verifyNodeResult)
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
          logger.log("Socker", this.id, "verified");
          this.setEncryptor(); // if all's right
        } catch (err) {
          logger.error("HS Verification", err);
        }
      }
    } catch (err) {
      logger.error("handle handshake", err);
    }
  }

  protected handleTest(data: Buffer) {
    console.log("TEST", data);
  }

  public destroy() {
    return this.socket.destroy();
  }
}

export default DogmaSocket;
