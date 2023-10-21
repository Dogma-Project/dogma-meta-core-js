import net from "node:net";
import crypto, { KeyObject } from "node:crypto";

import { Types } from "../types";
import generateSyncId from "./generateSyncId";
import { emit } from "./state";
import logger from "./logger";
import { Connection } from "./model";
import { DemuxStream, MuxStream, Encryption, Decryption } from "./streams";

class DogmaSocket {
  public readonly id: Types.Connection.Id;
  user_id: Types.User.Id | null;
  node_id: Types.Node.Id | null;

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

  constructor(socket: net.Socket, direction: Types.Connection.Direction) {
    this.socket = socket;
    this.id = generateSyncId(6);
    this.outSession = generateSyncId(12);
    this.user_id = null;
    this.node_id = null;
    this.direction = direction;

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
    this.socket.on("close", this.onClose);
    this.socket.on("error", this.onError);
    this.output.on("data", this.onData);
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

  private onData(result: Types.Streams.DemuxedResult) {
    console.log(result);
    switch (result.mx) {
      case Types.Streams.MX.handshake:
        break;
    }
  }

  private async onClose(hadError: boolean) {
    emit("offline", this.node_id);
    // this._offline(node_id); // move to component
    logger.info("connection", "closed", this.id);
    try {
      await Connection.delete(this.id);
      logger.log("connection", "successfully deleted connection", this.id);
    } catch (err) {
      logger.error("connection", "can't delete connection", err);
    }
  }

  private onError(err: Error) {
    logger.error("connection", this.id, err.name, err.message);
  }

  public destroy() {
    return this.socket.destroy();
  }
}

export default DogmaSocket;
