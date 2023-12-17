import { C_API, C_Event } from "@dogma-project/constants-meta";
import { User } from "./user";
import { Node } from "./node";

export namespace API {
  export type Request = {
    type: C_API.ApiRequestType;
    // action: Omit<C_API.ApiRequestAction, "result" | "error">;
    action:
      | C_API.ApiRequestAction.get
      | C_API.ApiRequestAction.push
      | C_API.ApiRequestAction.set
      | C_API.ApiRequestAction.delete;
    id?: number;
    payload?: any;
  };
  export type ResponseRequest = {
    type: C_API.ApiRequestType;
    // action: Omit<C_API.ApiRequestAction, "get" | "delete" | "error">;
    action: C_API.ApiRequestAction.set | C_API.ApiRequestAction.result;
    id?: number;
    payload?: any;
  };
  export type ResponseEvent = {
    type: C_API.ApiRequestType;
    // action: Omit<C_API.ApiRequestAction, "get" | "delete" | "error">;
    action: C_API.ApiRequestAction.set | C_API.ApiRequestAction.result;
    payload?: any;
    event: C_Event.Type;
  };
  export type ResponseError = {
    type: C_API.ApiRequestType;
    action: C_API.ApiRequestAction.error;
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
