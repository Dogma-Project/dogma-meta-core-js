import Connection from "./connection";
import Streams from "./streams";

declare namespace Message {
  export const enum Type {
    direct,
    user,
    chat,
  }
  export const enum Action {
    send,
    sync,
    edit,
    delete,
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

export default Message;
