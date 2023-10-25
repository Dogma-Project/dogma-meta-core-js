import DogmaSocket from "../modules/socket";
import User from "./user";
import Node from "./node";

declare namespace Connection {
  export type Id = string;
  export type IPv4 = string;
  export type IPv6 = string;
  export enum Status {
    notConnected,
    connected,
    error,
    notAuthorized,
    authorized,
  }
  export enum Group {
    unknown,
    all,
    friends,
    selfUser,
    selfNode,
    nobody,
  }
  export enum Direction {
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
}

export default Connection;
