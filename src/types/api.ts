import { C_API } from "../constants";
import { User } from "./user";
import { Node } from "./node";
import { Event } from "./event";
import { ValuesOf } from "./_main";

export namespace API {
  export type RequestType = ValuesOf<typeof C_API.ApiRequestType>;
  export type RequestAction = ValuesOf<typeof C_API.ApiRequestAction>;

  export type Request = {
    type: RequestType;
    action:
      | typeof C_API.ApiRequestAction.get
      | typeof C_API.ApiRequestAction.push
      | typeof C_API.ApiRequestAction.set
      | typeof C_API.ApiRequestAction.delete;
    id?: number;
    payload?: any;
  };
  export type ResponseRequest = {
    type: RequestType;
    action:
      | typeof C_API.ApiRequestAction.set
      | typeof C_API.ApiRequestAction.result;
    id?: number;
    payload?: any;
  };
  export type ResponseEvent = {
    type: RequestType;
    action:
      | typeof C_API.ApiRequestAction.set
      | typeof C_API.ApiRequestAction.result;
    payload?: any;
    event: Event.Types;
  };
  export type ResponseError = {
    type: RequestType;
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
