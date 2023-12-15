import net from "node:net";
import crypto from "node:crypto";
import EventEmitter from "node:events";
import {
  C_Connection,
  C_Streams,
  C_Keys,
  C_Constants,
} from "@dogma-project/constants-meta";
import * as Types from "../types";
import generateSyncId from "./generateSyncId";
import logger from "./logger";
import { Decoder, RsaEncoder, AesEncoder, PlainEncoder } from "./streams";
import { onData } from "./socket/index";
import Storage from "./storage";
import { createSha256Hash } from "./hash";
import ConnectionClass from "./connections";

class DogmaSocket extends EventEmitter {
  protected storageBridge: Storage;
  protected connectionsBridge: ConnectionClass;

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
    sync?: AesEncoder;
    web?: AesEncoder; // not implemented
    file?: AesEncoder; // not implemented
    relay?: AesEncoder; // not implemented
  };

  private decoder?: Decoder;

  public readonly direction: C_Connection.Direction;
  status: C_Connection.Status = C_Connection.Status.notConnected;
  group: C_Connection.Group = C_Connection.Group.unknown;

  private readonly outSession: string;
  private inSession?: string;

  private outSymmetricKey?: Buffer;
  private readonly inSymmetricKey: Buffer;

  private publicUserKey?: crypto.KeyObject;
  private publicNodeKey?: crypto.KeyObject;
  /**
   * [Peer] User id
   */
  public user_id?: Types.User.Id;
  /**
   * [Peer] Node id
   */
  public node_id?: Types.Node.Id;
  /**
   * Non-verified [peer] User id
   */
  public unverified_user_id?: Types.User.Id;
  /**
   * Non-verified [peer] Node id
   */
  public unverified_node_id?: Types.Node.Id;
  /**
   * [Peer] User name
   */
  public user_name: Types.User.Name = "Unknown Dogma User";
  /**
   * [Peer] Node name
   */
  public node_name: Types.User.Name = "Unknown Dogma Node";
  public readonly peer: Types.Connection.Peer;

  onDisconnect?: Function; // edit

  public tested: boolean = false;

  constructor(
    socket: net.Socket,
    direction: C_Connection.Direction,
    connections: ConnectionClass,
    storage: Storage
  ) {
    super();
    this.id = generateSyncId(6);
    this.outSession = generateSyncId(12);
    this.inSymmetricKey = crypto.randomBytes(32); // move to constants

    this.direction = direction;
    this.connectionsBridge = connections;
    this.storageBridge = storage;

    this.socket = socket;
    this.socket.on("close", this.onClose);
    this.socket.on("error", this.onError);
    this.input = {
      handshake: new PlainEncoder({
        id: C_Streams.MX.handshake,
      }),
    };
    this.input.handshake.pipe(this.socket); // unencrypted
    this.status = C_Connection.Status.connected;
    this.setDecoder();
    this.sendHandshake(C_Connection.Stage.init);
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
      type: C_Keys.FORMATS.TYPE,
      format: C_Keys.FORMATS.FORMAT,
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
      id: C_Streams.MX.key,
      publicKey: this.publicNodeKey,
    });
    this.input.key.pipe(this.socket);
  }

  private setAesEncoders() {
    if (!this.outSymmetricKey) {
      return logger.error("Socket", "Aes key didn't set");
    }

    this.input.test = new AesEncoder({
      id: C_Streams.MX.test,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.test.pipe(this.socket);

    this.input.control = new AesEncoder({
      id: C_Streams.MX.control,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.control.pipe(this.socket);

    this.input.messages = new AesEncoder({
      id: C_Streams.MX.messages,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.messages.pipe(this.socket);

    this.input.mail = new AesEncoder({
      id: C_Streams.MX.mail,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.mail.pipe(this.socket);

    this.input.dht = new AesEncoder({
      id: C_Streams.MX.dht,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.dht.pipe(this.socket);

    this.input.sync = new AesEncoder({
      id: C_Streams.MX.sync,
      symmetricKey: this.outSymmetricKey,
    });
    this.input.sync.pipe(this.socket);
  }

  /**
   * Determine connection group and authorization status
   */
  private setGroup() {
    if (!this.user_id || !this.node_id) {
      return this.destroy("Peer user_id or node_id not defined");
    }
    if (this.user_id === this.storageBridge.user.id) {
      // own user
      if (this.node_id === this.storageBridge.node.id) {
        // own node
        this.group = C_Connection.Group.selfNode;
      } else {
        this.group = C_Connection.Group.selfUser;
      }
      this.status = C_Connection.Status.authorized;
    } else {
      const inFriends = this.connectionsBridge.isUserAuthorized(this.user_id);
      if (inFriends) {
        this.group = C_Connection.Group.friends;
        this.status = C_Connection.Status.authorized;
      } else {
        this.group = C_Connection.Group.all;
        this.status = C_Connection.Status.notAuthorized;
      }
    }
  }

  /**
   * @todo complete
   * Check if not authorized can connect
   */
  private checkGroup() {
    if (this.status === C_Connection.Status.notAuthorized) {
      if (this.connectionsBridge.allowDiscoveryRequests(this.direction)) {
        // ok
      } else if (this.connectionsBridge.allowFriendshipRequests()) {
        if (this.direction == C_Connection.Direction.incoming) {
          this.emit("friendship", true);
          this.destroy("friendship request handled");
        } else {
          // edit
        }
      } else {
        this.destroy("not allowed!");
      }
    } else if (this.status === C_Connection.Status.authorized) {
      // ok
      logger.log("Socket", "Connection is authorized", this.id);
    } else {
      logger.warn(
        "Socket",
        "Something went wrong! Connection group is not determined",
        this.status
      );
      // destroy
    }
  }

  private test() {
    this.input.test && this.input.test.write(C_Constants.Messages.test);
  }

  private sendSymmetricKey() {
    this.input.key && this.input.key.write(this.inSymmetricKey);
  }

  private onData = onData;

  private onClose = async (hadError: boolean) => {
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

  private sendHandshake(stage: C_Connection.Stage) {
    if (!this.input) return logger.warn("Socket", "Input is not defined"); // edit
    if (!this.storageBridge.user.privateKey) return;
    if (!this.storageBridge.node.privateKey) return;
    if (!this.storageBridge.user.publicKey) return;
    if (!this.storageBridge.node.publicKey) return;
    if (!this.storageBridge.user.id) return;
    if (!this.storageBridge.node.id) return;

    if (stage === C_Connection.Stage.init) {
      const request: Types.Connection.Handshake.StageInitRequest = {
        stage,
        protocol: 2,
        session: this.outSession,
        user_id: this.storageBridge.user.id || "",
        user_name: this.storageBridge.user.name,
        node_id: this.storageBridge.node.id,
        node_name: this.storageBridge.node.name || "",
      };
      this.input.handshake.write(JSON.stringify(request));
    } else if (stage === C_Connection.Stage.verification) {
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

      if (parsed.stage === C_Connection.Stage.init) {
        this.inSession = parsed.session;
        this.unverified_user_id = parsed.user_id;
        this.user_name = parsed.user_name;
        this.unverified_node_id = parsed.node_id;
        this.node_name = parsed.node_name;
        this.sendHandshake(C_Connection.Stage.verification);
      } else if (parsed.stage === C_Connection.Stage.verification) {
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

  /**
   * Successfully tested AES encryption
   */
  private afterTest() {
    this.emit("online", this.node_id);
  }

  /**
   * @todo skip when discovery
   * Determine peer is online
   * @param data
   */
  protected handleTest(data: Buffer) {
    const msg = data.toString();
    if (msg === C_Constants.Messages.test) {
      this.tested = true;
      this.afterTest();
    } else {
      logger.warn("Socket", "Unknown test data", msg, msg.length);
      this.destroy();
    }
  }

  /**
   * Sets peer symmetric key
   * @param data
   */
  protected handleSymmetricKey(data: Buffer) {
    // check and validate
    this.outSymmetricKey = data;
    this.afterSymmetricKey();
  }

  /**
   * Stop current connection with specific reason
   * @param reason
   * @returns
   */
  public destroy(reason?: string) {
    if (reason) logger.log("Socket", "closed", reason);
    return this.socket.destroy();
  }
}

export default DogmaSocket;
