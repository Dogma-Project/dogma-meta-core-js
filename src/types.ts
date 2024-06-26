import { Certificate } from "./types/certificate";
import { Config } from "./types/config";
import { Connection } from "./types/connection";
import { DHT } from "./types/dht";
import { Discovery } from "./types/discovery";
import { Event } from "./types/event";
import { File } from "./types/file";
import { Keys } from "./types/keys";
import { Message } from "./types/message";
import { Node } from "./types/node";
import { Response } from "./types/response";
import { Streams } from "./types/streams";
import { Sync } from "./types/sync";
import { User } from "./types/user";
import { API } from "./types/api";
import { Model } from "./types/model";
import { System } from "./types/system";
import { Worker } from "./types/worker";

declare global {
  interface String {
    toPlainHex(): string | null;
  }
  interface Array<T> {
    unique(): Array<T>;
  }
  var prefix: string;
}

export type Request = DHT.Abstract | Message.Abstract | Sync.Abstract;
export {
  Certificate,
  Config,
  Connection,
  DHT,
  Discovery,
  Event,
  File,
  Keys,
  Message,
  Node,
  Response,
  Streams,
  Sync,
  User,
  API,
  Model,
  System,
  Worker
};
