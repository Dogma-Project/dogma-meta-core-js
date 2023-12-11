import WebSocket from "ws";
import { C_API } from "@dogma-project/constants-meta";
export declare namespace API {
    type ApiRequest = {
        type: C_API.ApiRequestType;
        action: C_API.ApiRequestAction;
        payload?: any;
    };
    interface DogmaWebSocket extends WebSocket {
        dogmaId: string;
        response: (request: API.ApiRequest) => void;
    }
}
