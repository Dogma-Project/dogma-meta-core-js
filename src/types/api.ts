import { C_API } from "@dogma-project/constants-meta";
import { User } from "./user";
import { Node } from "./node";

export namespace API {
  export type Request = {
    type: C_API.ApiRequestType;
    action: Omit<C_API.ApiRequestAction, "result">;
    id?: number;
    payload?: any;
  };
  export type Response = {
    type: C_API.ApiRequestType;
    action: Omit<C_API.ApiRequestAction, "get" | "delete">;
    id?: number;
    payload?: any;
  };

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
