import DogmaSocket from "../modules/socket";
import { User } from "./user";
import { Node } from "./node";

export namespace Connection {
  export type Id = string;
  export type IPv4 = string;
  export type IPv6 = string;
  export enum Status {
    error = -1,
    notConnected = 0,
    connected = 1,
    notAuthorized = 2,
    authorized = 3,
  }
  export enum Group {
    unknown = 0,
    all = 1,
    friends = 2,
    selfUser = 3,
    selfNode = 4,
    nobody = 5,
  }
  export enum Direction {
    outcoming = 0,
    incoming = 1,
  }
  export interface Description {
    connection_id: Id;
    address: string;
    user_id: User.Id;
    node_id: Node.Id;
    status: number; // edit
  }
  export type SocketArray = {
    [index: string]: DogmaSocket;
  };
  export type Peer = {
    host: string;
    port: number;
    address: string;
    public?: boolean;
    version?: 4 | 6;
  };
  export namespace Handshake {
    export type StageInitRequest = {
      stage: Stage.init;
      protocol: 1;
      session: string;
      user_id: User.Id;
      node_id: Node.Id;
    };
    export type StageVerificationRequest = {
      stage: Stage.verification;
      userKey: string;
      userSign: string;
      nodeKey: string;
      nodeSign: string;
    };
    export enum Stage {
      init = 0,
      verification = 1,
    }
  }
}
