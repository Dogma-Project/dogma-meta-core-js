import { Connection } from "./connection";
import { Node } from "./node";
import { User } from "./user";
import { C_DHT, C_Streams } from "../constants";
import { ValuesOf } from "./_main";

export namespace DHT {
  export type Model = {
    user_id: User.Id;
    node_id: Node.Id;
    public_ipv4: Connection.IPv4;
    port: number;
  };

  export namespace LookUp {
    export interface Request {
      type: typeof C_DHT.Request.lookup;
      action: typeof C_DHT.Action.get;
      data: Request.Data;
    }
    export namespace Request {
      export type Data = {
        user_id: User.Id;
        node_id?: Node.Id;
      };
    }
    export interface Answer {
      type: typeof C_DHT.Request.lookup;
      action: typeof C_DHT.Action.set;
      data: Answer.Data[];
    }
    export namespace Answer {
      export type Data = {
        public_ipv4: string;
        user_id: User.Id;
        node_id: Node.Id;
      };
    }
    export type Common = Request | Answer;
  }

  export namespace Announce {
    export interface Request {
      type: typeof C_DHT.Request.announce;
      action: typeof C_DHT.Action.push;
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
      type: typeof C_DHT.Request.revoke;
      action: typeof C_DHT.Action.push;
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
    class: typeof C_Streams.MX.dht;
    body: DHT.Requests;
  };

  export type Type = ValuesOf<typeof C_DHT.Type>;
}
