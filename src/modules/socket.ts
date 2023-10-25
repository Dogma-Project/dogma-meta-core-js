import net from "node:net";
import EventEmitter from "node:events";

import crypto, { KeyObject } from "node:crypto";

import * as Types from "../types";
import generateSyncId from "./generateSyncId";
import logger from "./logger";
import { DemuxStream, MuxStream, Encryption, Decryption } from "./streams";
import { onData } from "./socket/index";
import StateManager from "./state";

/**
 * @todo add online event
 */

class DogmaSocket extends EventEmitter {
  public readonly id: Types.Connection.Id;
  user_id: Types.User.Id | null;
  node_id: Types.Node.Id | null;
  stateBridge: StateManager;
  private readonly socket: net.Socket;
  public input: {
    handshake: MuxStream;
    test: MuxStream;
    control: MuxStream;
    messages: MuxStream;
    mail: MuxStream;
    dht: MuxStream;
  };
  private readonly output: DemuxStream;

  public readonly direction: Types.Connection.Direction;
  status: Types.Connection.Status = Types.Connection.Status.notConnected;
  group: Types.Connection.Group = Types.Connection.Group.unknown;

  outSession: string;
  inSession?: string;

  publicUserKey: any; // edit
  publicNodeKey: any; // edit
  onDisconnect?: Function; // edit

  tested: boolean = false;

  constructor(
    socket: net.Socket,
    direction: Types.Connection.Direction,
    state: StateManager
  ) {
    super();
    this.socket = socket;
    this.id = generateSyncId(6);
    this.outSession = generateSyncId(12);
    this.user_id = null;
    this.node_id = null;
    this.direction = direction;
    this.stateBridge = state;

    this.input = {
      handshake: new MuxStream({ substream: Types.Streams.MX.handshake }),
      test: new MuxStream({ substream: Types.Streams.MX.test }),
      control: new MuxStream({ substream: Types.Streams.MX.control }),
      messages: new MuxStream({ substream: Types.Streams.MX.messages }),
      mail: new MuxStream({ substream: Types.Streams.MX.mail }),
      dht: new MuxStream({ substream: Types.Streams.MX.dht }),
    };
    this.output = new DemuxStream({});
    this.setPipes();
    this.socket.on("close", this._onClose);
    this.socket.on("error", this.onError);
    this.output.on("data", this._onData);
  }

  private setPipes() {
    // edit, just testing
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    const encryptor = new Encryption({ publicKey: keypair.publicKey });
    const decryptor = new Decryption({ privateKey: keypair.privateKey });

    this.input.handshake.pipe(encryptor).pipe(this.socket);
    this.input.test.pipe(encryptor).pipe(this.socket);
    this.input.control.pipe(encryptor).pipe(this.socket);
    this.input.messages.pipe(encryptor).pipe(this.socket);
    this.input.mail.pipe(encryptor).pipe(this.socket);
    this.input.dht.pipe(encryptor).pipe(this.socket);

    this.socket.pipe(decryptor).pipe(this.output);
  }

  private _onData = onData;

  private async _onClose(hadError: boolean) {
    // edit
    this.emit("offline", this.node_id);
    // this._offline(node_id); // move to component
    logger.info("connection", "closed", this.id);
  }

  private onError(err: Error) {
    logger.error("connection", this.id, err.name, err.message);
  }

  public handleHandshake(data: Buffer) {
    console.log("HS", data);
  }

  public handleTest(data: Buffer) {
    console.log("TEST", data);
  }

  public destroy() {
    return this.socket.destroy();
  }
}

export default DogmaSocket;
