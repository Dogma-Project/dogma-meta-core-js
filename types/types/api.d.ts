import WebSocket from "ws";
import { C_API } from "@dogma-project/constants-meta";
import { User } from "./user";
import { Node } from "./node";
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
    interface NetworkNodesData {
        id: Node.Id;
        name: Node.Name;
        current: boolean;
        online: boolean;
    }
    interface NetworkData {
        id: User.Id;
        name: User.Name;
        current: boolean;
        requested: true | undefined;
        nodes: NetworkNodesData[];
    }
}
