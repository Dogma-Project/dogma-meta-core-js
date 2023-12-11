/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "node:http";
export default function ResponseError(res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
}, status: number, payload?: {
    code?: number;
    message?: string;
}): void;
