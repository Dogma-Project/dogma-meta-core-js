import { C_API, C_Event } from "@dogma-project/constants-meta";
import { User } from "./user";
import { Node } from "./node";
export declare namespace API {
    type Request = {
        type: C_API.ApiRequestType;
        action: Omit<C_API.ApiRequestAction, "result">;
        id?: number;
        payload?: any;
    };
    type ResponseRequest = {
        type: C_API.ApiRequestType;
        action: Omit<C_API.ApiRequestAction, "get" | "delete">;
        payload?: any;
        id?: number;
    };
    type ResponseEvent = {
        type: C_API.ApiRequestType;
        action: Omit<C_API.ApiRequestAction, "get" | "delete">;
        payload?: any;
        event: C_Event.Type;
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
