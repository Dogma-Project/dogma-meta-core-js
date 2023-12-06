import net from "node:net";
import crypto from "node:crypto";
import EventEmitter from "node:events";

import * as Types from "../types";
import generateSyncId from "./generateSyncId";
import logger from "./logger";
import { Decoder, RsaEncoder, AesEncoder, PlainEncoder } from "./streams";
import { onData } from "./socket/index";
import StateManager from "./state";
import Storage from "./storage";
import { createSha256Hash } from "./hash";

class DogmaSocket extends EventEmitter {
  protected stateBridge: StateManager;
  protected storageBridge: Storage;

  public readonly id: Types.Connection.Id;
  private readonly socket: net.Socket;

  public input: {
    handshake: PlainEncoder;
    key?: RsaEncoder;
    test?: AesEncoder;
    control?: AesEncoder;
    messages?: AesEncoder;
    mail?: AesEncoder;
    dht?: AesEncoder;
    web?: AesEncoder; // not implemented
    file?: AesEncoder; // not implemented
    relay?: AesEncoder; // not implemented
  };

  private decoder?: Decoder;

  public readonly direction: Types.Connection.Direction;
  status: Types.Connection.Status = Types.Connection.Status.notConnected;
  group: Types.Connection.Group = Types.Connection.Group.unknown;

  private readonly outSession: string;
  private inSession?: string;

  private outSymmetricKey?: Buffer;
  private readonly inSymmetricKey: Buffer;

  private publicUserKey?: crypto.KeyObject;
  private publicNodeKey?: crypto.KeyObject;
  public user_id?: Types.User.Id;
  public node_id?: Types.Node.Id;
  public unverified_user_id?: Types.User.Id;
  public unverified_node_id?: Types.Node.Id;
  public readonly peer: Types.Connection.Peer;
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
    this.inSymmetricKey = crypto.randomBytes(32);

    this.direction = direction;
    this.stateBridge = state;
    this.storageBridge = storage;

    this.socket = socket;
    this.socket.on("close", this.onClose);
    this.socket.on("error", this.onError);
    this.input = {
      handshake: new PlainEncoder({
        id: Types.Streams.MX.handshake,
      }),
    };
    this.input.handshake.pipe(this.socket); // unencrypted
    this.status = Types.Connection.Status.connected;
    this.setDecoder();
    this.sendHandshake(Types.Connection.Handshake.Stage.init);
    const host = socket.remoteAddress;
    const port = socket.remotePort;
    const family = socket.remoteFamily;
    if (host && port && family) {
      this.peer = {
        host,
        port,
        address: `${host}:${port}`,
        version: family === "IPv4" ? 4 : 6,
        public: host.indexOf("192.168.") === -1, // edit for ipv6
      };
    } else {
      throw "Unknown address";
    }
  }

  private setDecoder() {
    if (!this.storageBridge.node.privateKey) return; // edit
    const privateNodeKey = crypto.createPrivateKey({
      key: this.storageBridge.node.privateKey,
      type: Types.Keys.FORMATS.TYPE,
      format: Types.Keys.FORMATS.FORMAT,
    });
    this.decoder = new Decoder(privateNodeKey);
    this.decoder.symmetricKey = this.inSymmetricKey;
    this.decoder.on("data", (data) => this.onData(data));
    this.socket.on("data", (data) => {
      this.decoder && this.decoder.input(data);
    });
  }

  private setRsaEncoders() {
    if (!this.publicNodeKey) {
      return logger.error("Socket", "Rsa key didn't set");
    }
    this.input.key = new RsaEncoder({
      id: Types.Streams.MX.key,
      publicKey: this.publicNodeKey,
    });
    this.input.key.pipe(this.socket);
  }

  private setAesEncoders() {
    if (!this.outSymmetricKey) {
      return logger.error("Socket", "Aes key didn't set");
    }

    this.input.test = new AesEncoder({
      id: Types.Streams.MX.test,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.test.pipe(this.socket);

    this.input.control = new AesEncoder({
      id: Types.Streams.MX.control,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.control.pipe(this.socket);

    this.input.messages = new AesEncoder({
      id: Types.Streams.MX.messages,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.messages.pipe(this.socket);

    this.input.mail = new AesEncoder({
      id: Types.Streams.MX.mail,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.mail.pipe(this.socket);

    this.input.dht = new AesEncoder({
      id: Types.Streams.MX.dht,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.dht.pipe(this.socket);
  }

  private setGroup() {
    if (!this.user_id || !this.node_id) {
      return this.destroy("Own user_id or node_id not defined");
    }
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
      if (!users || !Array.isArray(users)) {
        return this.destroy("Users data not found");
      }
      const inFriends = users.find((user) => user.user_id === this.user_id);
      if (inFriends) {
        this.group = Types.Connection.Group.friends;
      } else {
        this.group = Types.Connection.Group.all;
      }
    }
  }

  private checkGroup() {
    //
  }

  private test() {
    this.input.test && this.input.test.write(Types.Constants.Messages.test);
  }

  private sendSymmetricKey() {
    this.input.key && this.input.key.write(this.inSymmetricKey);
  }

  private onData = onData;

  private onClose = async (hadError: boolean) => {
    // edit
    this.emit("offline", this.node_id);
    logger.info("connection", "closed", this.id);
  };

  private onError = (err: Error) => {
    logger.error("connection", this.id, err.name, err.message);
  };

  private sign(data: string, privateKey: crypto.KeyLike) {
    const signature = crypto.createSign("sha256");
    signature.update(data);
    signature.end();
    return signature.sign(privateKey, "hex");
  }

  private verify(data: string, publicKey: crypto.KeyLike, sign: string) {
    const verification = crypto.createVerify("sha256");
    verification.update(data);
    verification.end();
    return verification.verify(publicKey, sign, "hex");
  }

  private sendHandshake(stage: Types.Connection.Handshake.Stage) {
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
        protocol: 2,
        session: this.outSession,
        user_id: this.storageBridge.user.id,
        node_id: this.storageBridge.node.id,
      };
      this.input.handshake.write(JSON.stringify(request));
    } else if (stage === Types.Connection.Handshake.Stage.verification) {
      if (this.inSession === undefined) {
        return logger.warn("Socket", "unknown inSession");
      }

      const userSign = this.sign(
        this.inSession,
        this.storageBridge.user.privateKey
      );
      const nodeSign = this.sign(
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
        this.sendHandshake(Types.Connection.Handshake.Stage.verification);
      } else if (
        parsed.stage === Types.Connection.Handshake.Stage.verification
      ) {
        try {
          const publicUserKey = crypto.createPublicKey(parsed.userKey); // edit
          const publicNodeKey = crypto.createPublicKey(parsed.nodeKey); // edit

          const verifyUser = this.verify(
            this.outSession,
            publicUserKey,
            parsed.userSign
          );
          if (!verifyUser)
            return logger.log("Socket", "User not verified", this.id);

          const verifyNode = this.verify(
            this.outSession,
            publicNodeKey,
            parsed.nodeSign
          );

          if (!verifyNode)
            return logger.log("Socket", "Node not verified", this.id);

          this.publicUserKey = publicUserKey;
          this.publicNodeKey = publicNodeKey;

          this.user_id = createSha256Hash(parsed.userKey);
          if (this.unverified_user_id !== this.user_id) return; // edit ban
          this.node_id = createSha256Hash(parsed.nodeKey);
          if (this.unverified_node_id !== this.node_id) return; // edit ban

          logger.log("Socket", this.id, "verified");
          this.afterVerification();
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

  private afterVerification() {
    this.setGroup();
    this.checkGroup();
    this.setRsaEncoders();
    this.sendSymmetricKey();
  }

  private afterSymmetricKey() {
    this.setAesEncoders();
    this.test();
  }

  private afterTest() {
    this.emit("online", this.node_id);
  }

  protected handleTest(data: Buffer) {
    const msg = data.toString();
    if (msg === Types.Constants.Messages.test) {
      this.tested = true;
      this.afterTest();
    } else {
      logger.warn("Socket", "Unknown test data", msg, msg.length);
      this.destroy();
    }
  }

  protected handleSymmetricKey(data: Buffer) {
    // check and validate
    this.outSymmetricKey = data;
    this.afterSymmetricKey();
  }

  public destroy(reason?: string) {
    if (reason) logger.log("Socket", "closed", reason);
    return this.socket.destroy();
  }
}

export default DogmaSocket;
