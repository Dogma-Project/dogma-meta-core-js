import { Connection } from "./connection";
import { Node } from "./node";
import { Streams } from "./streams";
import { User } from "./user";

export namespace DHT {
  export enum Type {
    dhtAnnounce = 0,
    dhtLookup = 1,
    dhtBootstrap = 2,
  }
  export enum Action {
    get = 0,
    set = 1,
    push = 2,
  }
  export enum Request {
    announce = 0,
    lookup = 1,
    revoke = 2,
  }
  export enum Response {
    error = -1,
    alreadyPresent = 0,
    ok = 1,
  }

  export type Model = {
    user_id: User.Id;
    node_id: Node.Id;
    public_ipv4: Connection.IPv4;
    port: number;
  };

  export namespace LookUp {
    export interface Request {
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
    export interface Answer {
      type: DHT.Request.lookup;
      action: DHT.Action.set;
      data: Answer.Data[];
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
    export interface Request {
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
    export interface Request {
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
  export type Requests = LookUp.Request | Announce.Request | Revoke.Request;
  export type CardQuery<T> = {
    request: T;
    from: FromData;
  };
  export type CardAnswer = {
    request: LookUp.Answer;
    from: FromData;
  };
  export type Card = CardQuery<Requests> | CardAnswer;
  export type Abstract = {
    class: Streams.MX.dht;
    body: DHT.Requests;
  };
}
