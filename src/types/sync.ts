import { C_Streams, C_Sync } from "../constants";
import { ValuesOf } from "./_main";

export namespace Sync {
  export type Id = string;

  export type Type = ValuesOf<typeof C_Sync.Type>;

  export type Result = {
    [index in Type]?: object[];
  };

  export interface RequestFull {
    action: typeof C_Sync.Action.get;
    /**
     * Get all data from timestamp
     */
    from: number;
    time: number;
  }
  export interface RequestPartial extends RequestFull {
    type: Type;
  }
  export type Request = RequestFull | RequestPartial;

  export interface ResponseFull {
    action: typeof C_Sync.Action.push;
    /**
     * Array of db records
     */
    payload: Result;
    time: number;
  }
  export interface ResponsePartial extends ResponseFull {
    type: Type;
  }
  export type Response = ResponseFull | ResponsePartial;

  export interface Notify {
    action: typeof C_Sync.Action.notify;
    type: Type;
    time: number;
  }

  export type Data = Request | Response | Notify;

  export type Abstract = {
    class: typeof C_Streams.MX.sync;
    body: Data;
  };
}
