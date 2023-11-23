import { Certificate } from "./types/certificate";
import { Config } from "./types/config";
import { Connection } from "./types/connection";
import { Constants } from "./types/constants";
import { DHT } from "./types/dht";
import { Discovery } from "./types/discovery";
import { Dummmy } from "./types/dummy";
import { Event } from "./types/event";
import { File } from "./types/file";
import { Keys } from "./types/keys";
import { Message } from "./types/message";
import { Node } from "./types/node";
import { Response } from "./types/response";
import { Streams } from "./types/streams";
import { Sync } from "./types/sync";
import { System } from "./types/system";
import { User } from "./types/user";

declare global {
  interface String {
    toPlainHex(): string | null;
  }
  interface Array<T> {
    unique(): Array<T>;
  }
}

export type Request = DHT.Abstract | Message.Abstract | Dummmy.Abstract;
export {
  Certificate,
  Config,
  Connection,
  Constants,
  DHT,
  Discovery,
  Dummmy,
  Event,
  File,
  Keys,
  Message,
  Node,
  Response,
  Streams,
  Sync,
  System,
  User,
};
