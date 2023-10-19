import EncodeStream from "./libs/streams/encode";
import net from "node:net";

export namespace Types {
  export namespace Node {
    export type Id = string;
    export type Model = {
      node_id: Node.Id;
      user_id: User.Id;
      name: string;
      public_ipv4?: string;
      public_ipv6?: string;
      local_ipv4?: string;
      local_ipv6?: string;
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
    export type Params = {
      router: number;
      bootstrap: Constants.DhtPermission;
      dhtLookup: Constants.DhtPermission;
      dhtAnnounce: Constants.DhtPermission;
      external: string;
      autoDefine: Constants.Boolean;
      public_ipv4: string;
      stun?: number; // edit
      turn?: number; // edit
    };
  }
  export namespace Sync {
    export type Id = string;
  }
  export namespace Discovery {
    export type Card = {
      type: string;
      user_id: User.Id;
      node_id: Node.Id;
      port: number;
    };
  }

  export namespace DHT {
    export type Type = "dhtAnnounce" | "dhtBootstrap" | "dhtLookup";
    export type Request = "announce" | "lookup" | "revoke";
    export type Action = "get" | "set";
    export namespace RequestData {
      interface Main {
        type: DHT.Request;
        action: DHT.Action;
        port: number;
      }
      export type LookupData = {
        user_id: User.Id;
        node_id?: Node.Id;
      };
      export type AnnounceData = {
        port: number;
      };

      export type LookupAnswerData = {
        user_id: User.Id;
        node_id: Node.Id;
        public_ipv4: string;
        port: number;
      };
      export interface Lookup extends Main {
        type: "lookup";
        action: "get";
        user_id: User.Id;
        node_id?: Node.Id;
      }
      export interface LookupAnswer extends Omit<Lookup, "action"> {
        action: "set";
        data: RequestData.LookupAnswerData;
      }

      export type Outgoing = AnnounceData | LookupData;

      export interface Announce extends Main {
        type: "announce";
        action: DHT.Action;
      }
      export interface Revoke extends Main {
        type: "revoke";
        action: DHT.Action;
      }
    }
    export type FromData = {
      user_id: User.Id;
      node_id: Node.Id;
      public_ipv4: string;
    };
    export type CardQuery = {
      request: RequestData.Lookup | RequestData.Announce | RequestData.Revoke;
      from: FromData;
    };
    export type CardAnswer = {
      request: RequestData.LookupAnswer;
      from: FromData;
    };
    export type Card = CardQuery | CardAnswer;
  }

  export namespace Connection {
    export type Id = string;
    export interface Description {
      connection_id: Id;
      address: string;
      user_id: User.Id;
      node_id: Node.Id;
      status: number; // edit
    }
    export interface Multiplex {
      control: EncodeStream;
      messages: EncodeStream;
      files: EncodeStream;
      dht: EncodeStream;
    }
    export interface Socket extends net.Socket {
      dogma: Description;
      multiplex: Multiplex;
    }
    export type SocketArray = {
      [index: string]: Socket;
    };
    export type Peer = {
      host: string;
      port: number;
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

  export type Store = {
    config: Config.Params;
    ca: any[];
    users: any[]; // edit
    nodes: any[]; // edit
    node: {
      name: string;
      id: Node.Id;
      key: Buffer | null;
      cert: Buffer | null;
      public_ipv4: string;
    };
    user: {
      name: string;
      id: Node.Id;
      key: Buffer | null;
      cert: Buffer | null;
    };
  };

  export namespace Key {
    export type InitialParams = {
      name: string; // check
      keylength: 1024 | 2048 | 4096;
      seed?: string;
    };
  }

  export namespace Constants {
    export type Boolean = 0 | 1;
    export type DhtPermission = 0 | 1 | 2 | 3;
    export type MessagesType = 0 | 1 | 2;
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
}

declare global {
  interface String {
    toPlainHex(): string | null;
  }
  interface Array<T> {
    unique(): Array<T>;
  }
}
