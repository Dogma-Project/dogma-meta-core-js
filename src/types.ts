import DogmaSocket from "./modules/socket";

export namespace Types {
  export namespace Node {
    export type Id = string;
    export type Model = {
      node_id: Node.Id;
      user_id: User.Id;
      name: string;
      public_ipv4?: Connection.IPv4;
      public_ipv6?: Connection.IPv4;
      local_ipv4?: Connection.IPv6;
      local_ipv6?: Connection.IPv6;
      sync_id?: Sync.Id;
    };
  }
  export namespace User {
    export type Id = string;
    export type Model = {
      user_id: User.Id;
      name: string;
      avatar?: string;
      sync_id?: Sync.Id;
    };
  }
  export namespace Config {
    export type Model = {
      [index: string]: string | number; // edit
    };
    export interface Params {
      _router: number;
      router: number;
      bootstrap: Connection.Group;
      dhtLookup: Connection.Group;
      dhtAnnounce: Connection.Group;
      external: string;
      autoDefine: Constants.Boolean;
      public_ipv4: string;
      stun?: number; // edit
      turn?: number; // edit
    }
  }
  export namespace Sync {
    export type Id = string;
  }
  export namespace Discovery {
    export type Card = {
      type: "dogma-router";
      user_id: User.Id;
      node_id: Node.Id;
      port: number;
    };
    export type Candidate = {
      type: "dogma-router";
      user_id: User.Id;
      node_id: Node.Id;
      local_ipv4: Connection.IPv6;
      local_ipv6?: Connection.IPv6;
    };
  }

  export namespace DHT {
    export enum Type {
      dhtAnnounce,
      dhtLookup,
      dhtBootstrap,
    }
    export enum Action {
      get,
      set,
      push,
    }
    export enum Request {
      announce,
      lookup,
      revoke,
    }
    interface Main {
      type: DHT.Request;
      action: DHT.Action;
    }

    export namespace LookUp {
      export interface Request extends Main {
        type: DHT.Request.lookup;
        action: DHT.Action.get;
        data: Request.Data;
      }
      export namespace Request {
        export type Data = {
          user_id: User.Id;
          node_id?: Node.Id;
        };
      }
      export interface Answer extends Main {
        type: DHT.Request.lookup;
        action: DHT.Action.set;
        data: Answer.Data;
      }
      export namespace Answer {
        export type Data = {
          public_ipv4: string;
          user_id: User.Id;
          node_id: Node.Id;
        };
      }
    }

    export namespace Announce {
      export interface Request extends Main {
        type: DHT.Request.announce;
        action: DHT.Action.push;
        data: Request.Data;
      }
      export namespace Request {
        export type Data = {
          port: number;
        };
      }
    }

    export namespace Revoke {
      export interface Request extends Main {
        type: DHT.Request.revoke;
        action: DHT.Action.push;
        data: Request.Data;
      }
      export namespace Request {
        export type Data = {};
      }
    }

    export type FromData = {
      user_id: User.Id;
      node_id: Node.Id;
      public_ipv4: string;
    };
    export type CardQuery = {
      request: LookUp.Request | Announce.Request | Revoke.Request;
      from: FromData;
    };
    export type CardAnswer = {
      request: LookUp.Answer;
      from: FromData;
    };
    export type Card = CardQuery | CardAnswer;
  }

  export namespace Connection {
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

  export namespace Certificate {
    export namespace Validation {
      export type Result = {
        result: number;
        error: any;
        user_id: User.Id;
        name: string;
        cert: string; // edit
        node: {
          node_id: Node.Id;
          name: string;
          public_ipv4: string;
          port: number;
        };
        own: boolean;
      };
    }
  }

  export namespace Key {
    export type InitialParams = {
      name: string; // check
      keylength: 1024 | 2048 | 4096;
      seed?: string;
    };
  }

  export namespace Constants {
    export enum Boolean {
      false = 0,
      true = 1,
    }
  }

  export namespace File {
    export type Description = {
      descriptor: number; // check
      size: number;
      pathname: string;
      data?: string;
    };
  }

  export namespace Response {
    export type Main = {
      id: number | string;
      code: number;
      message?: string;
    };
  }

  export namespace Message {
    export enum Type {
      direct,
      user,
      chat,
    }
    export namespace Class {
      interface Base {
        id: number;
      }
      export interface TextMessage extends Base {
        text: string;
      }
      export interface FilesMessage extends Base {
        files: Message.File[];
        text?: string;
      }
      export interface StickerMessage extends Base {
        sticker: any; // edit
      }
      export type Abstract = TextMessage | FilesMessage | StickerMessage;
    }
    export type FileShare = {
      name: string;
      size: number;
      type: number; // edit
      pathname: string; // edit
    };
    export type FileEncoded = {
      name: string;
      size: number;
      type: number; // edit
      data: string; // edit
    };
    export type File = FileShare | FileEncoded;
  }

  export namespace Streams {
    export enum MX {
      handshake,
      test,
      control,
      messages,
      mail,
      dht,
    }
    export type DemuxedResult = {
      mx: MX;
      data: Buffer;
      descriptor?: string; // edit
    };
  }

  export namespace Event {
    export enum Action {
      update,
      set,
    }
    export type Payload = any;
    export type Type = string; // edit
    export type Listenter = (
      action: Action,
      payload: Payload,
      type: Type
    ) => void;
    export type ArrayOfListeners = [Type[], Listenter] | [];
  }

  export namespace System {
    export enum LogLevel {
      nothing,
      errors,
      debug,
      info,
      warnings,
      logs,
    }
    export enum States {
      error,
      disabled,
      ready,
      empty,
      reload,
      limited,
      ok,
      full,
    }
  }
}

declare global {
  interface String {
    toPlainHex(): string | null;
  }
  interface Array<T> {
    unique(): Array<T>;
  }
}
