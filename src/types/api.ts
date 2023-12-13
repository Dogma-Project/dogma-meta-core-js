import WebSocket from "ws";
import { C_API } from "@dogma-project/constants-meta";
import { User } from "./user";
import { Node } from "./node";

export namespace API {
  export type ApiRequest = {
    type: C_API.ApiRequestType;
    action: C_API.ApiRequestAction;
    payload?: any;
  };

  export interface DogmaWebSocket extends WebSocket {
    dogmaId: string;
    response: (request: API.ApiRequest) => void;
  }

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
