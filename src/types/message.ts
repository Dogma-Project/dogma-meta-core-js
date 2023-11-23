import { Connection } from "./connection";
import { Streams } from "./streams";

export namespace Message {
  export enum Type {
    direct = 0,
    user = 1,
    chat = 2,
  }
  export enum Action {
    send = 0,
    sync = 1,
    edit = 2,
    delete = 3,
  }

  export type Model = {
    id: string;
    sync_id: string;
    text: string;
    direction: Connection.Direction;
    format: number; // edit
    type: Type;
  };

  export namespace Send {
    export interface Request {
      type: Type;
      action: Action.send;
      data: Request.Data;
    }
    export namespace Request {
      export type Data = {};
    }
  }

  export namespace Delete {
    export interface Request {
      type: Type;
      action: Action.delete;
      data: Request.Data;
    }
    export namespace Request {
      export type Data = {};
    }
  }

  export type Requests = Send.Request | Delete.Request;
  export type Abstract = {
    class: Streams.MX.messages;
    body: Requests;
  };
}
