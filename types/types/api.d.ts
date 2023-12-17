import { C_API, C_Event } from "@dogma-project/constants-meta";
import { User } from "./user";
import { Node } from "./node";
export declare namespace API {
    type Request = {
        type: C_API.ApiRequestType;
        action: C_API.ApiRequestAction.get | C_API.ApiRequestAction.push | C_API.ApiRequestAction.set | C_API.ApiRequestAction.delete;
        id?: number;
        payload?: any;
    };
    type ResponseRequest = {
        type: C_API.ApiRequestType;
        action: C_API.ApiRequestAction.set | C_API.ApiRequestAction.result;
        id?: number;
        payload?: any;
    };
    type ResponseEvent = {
        type: C_API.ApiRequestType;
        action: C_API.ApiRequestAction.set | C_API.ApiRequestAction.result;
        payload?: any;
        event: C_Event.Type;
    };
    type ResponseError = {
        type: C_API.ApiRequestType;
        action: C_API.ApiRequestAction.error;
        id?: number;
        payload?: any;
    };
    type Response = ResponseRequest | ResponseEvent;
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
