import { IncomingMessage, ServerResponse } from "node:http";

export default function ResponseError(
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
  status: number,
  payload: {
    code?: number;
    message?: string;
  } = {}
) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}
