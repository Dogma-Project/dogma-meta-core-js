import { C_Streams, C_Sync } from "@dogma-project/constants-meta";

export namespace Sync {
  export type Id = string;

  export type Result = {
    [index in C_Sync.Type]?: object[]; // edit
  };

  export interface RequestFull {
    action: C_Sync.Action.get;
    /**
     * Get all data from timestamp
     */
    from: number;
    time: number;
  }
  export interface RequestPartial extends RequestFull {
    type: C_Sync.Type;
  }
  export type Request = RequestFull | RequestPartial;

  export interface ResponseFull {
    action: C_Sync.Action.push;
    /**
     * Array of db records
     */
    payload: Result;
    time: number;
  }
  export interface ResponsePartial extends ResponseFull {
    type: C_Sync.Type;
  }
  export type Response = ResponseFull | ResponsePartial;

  export type Data = Request | Response;

  export type Abstract = {
    class: C_Streams.MX.sync;
    body: Data;
  };
}
