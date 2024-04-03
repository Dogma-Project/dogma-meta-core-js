import { C_API, C_Event } from "../constants";
import { User } from "./user";
import { Node } from "./node";
import { ValuesOf } from "./_main";

export namespace API {
  export type Request = {
    type: ValuesOf<typeof C_API.ApiRequestType>;
    // action: Omit<ValuesOf<typeof C_API.ApiRequestAction>, "result" | "error">;
    action:
      | typeof C_API.ApiRequestAction.get
      | typeof C_API.ApiRequestAction.push
      | typeof C_API.ApiRequestAction.set
      | typeof C_API.ApiRequestAction.delete;
    id?: number;
    payload?: any;
  };
  export type ResponseRequest = {
    type: ValuesOf<typeof C_API.ApiRequestType>;
    // action: Omit<C_API.ApiRequestAction, "get" | "delete" | "error">;
    action:
      | typeof C_API.ApiRequestAction.set
      | typeof C_API.ApiRequestAction.result;
    id?: number;
    payload?: any;
  };
  export type ResponseEvent = {
    type: ValuesOf<typeof C_API.ApiRequestType>;
    action:
      | typeof C_API.ApiRequestAction.set
      | typeof C_API.ApiRequestAction.result;
    payload?: any;
    event: C_Event.Type;
  };
  export type ResponseError = {
    type: ValuesOf<typeof C_API.ApiRequestType>;
    action: typeof C_API.ApiRequestAction.error;
    id?: number;
    payload?: any;
  };
  export type Response = ResponseRequest | ResponseEvent;

  export interface NetworkNodesData {
    id: Node.Id;
    name: Node.Name;
    current: boolean;
    online: boolean;
  }

  export interface NetworkData {
    id: User.Id;
    name: User.Name;
    current: boolean;
    requested: true | undefined;
    nodes: NetworkNodesData[];
  }
}
