import DogmaSocket from "../modules/socket";
import User from "./user";
import Node from "./node";

declare namespace Connection {
  export type Id = string;
  export type IPv4 = string;
  export type IPv6 = string;
  export const enum Status {
    notConnected,
    connected,
    error,
    notAuthorized,
    authorized,
  }
  export const enum Group {
    unknown,
    all,
    friends,
    selfUser,
    selfNode,
    nobody,
  }
  export const enum Direction {
    outcoming,
    incoming,
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
    export const enum Stage {
      init = 0,
      verification = 1,
    }
  }
}

export default Connection;
