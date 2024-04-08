import { C_Streams, C_Connection, C_Message } from "../constants";
import { ValuesOf } from "./_main";

export namespace Message {
  export type Model = {
    id: string;
    sync_id: string;
    text: string;
    direction: ValuesOf<typeof C_Connection.Direction>;
    format: number; // edit
    type: ValuesOf<typeof C_Message.Type>;
  };

  export namespace Send {
    export interface Request {
      type: ValuesOf<typeof C_Message.Type>;
      action: typeof C_Message.Action.send;
      data: Request.Data;
    }
    export namespace Request {
      export type Data = {};
    }
  }

  export namespace Delete {
    export interface Request {
      type: ValuesOf<typeof C_Message.Type>;
      action: typeof C_Message.Action.delete;
      data: Request.Data;
    }
    export namespace Request {
      export type Data = {};
    }
  }

  export type Requests = Send.Request | Delete.Request;
  export type Abstract = {
    class: typeof C_Streams.MX.messages;
    body: Requests;
  };
}
