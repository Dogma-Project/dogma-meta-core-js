import WebSocket from "ws";
import { C_API } from "@dogma-project/constants-meta";

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
}
