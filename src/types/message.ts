import { C_Streams, C_Connection, C_Message } from "./constants";

export namespace Message {
  export type Model = {
    id: string;
    sync_id: string;
    text: string;
    direction: C_Connection.Direction;
    format: number; // edit
    type: C_Message.Type;
  };

  export namespace Send {
    export interface Request {
      type: C_Message.Type;
      action: C_Message.Action.send;
      data: Request.Data;
    }
    export namespace Request {
      export type Data = {};
    }
  }

  export namespace Delete {
    export interface Request {
      type: C_Message.Type;
      action: C_Message.Action.delete;
      data: Request.Data;
    }
    export namespace Request {
      export type Data = {};
    }
  }

  export type Requests = Send.Request | Delete.Request;
  export type Abstract = {
    class: C_Streams.MX.messages;
    body: Requests;
  };
}
