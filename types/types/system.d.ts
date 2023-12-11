/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "node:http";
export declare namespace System {
    namespace API {
        type Request = {
            path: string[];
            query: URLSearchParams;
            method: string;
        };
        type Response = ServerResponse<IncomingMessage> & {
            req: IncomingMessage;
        };
    }
}
