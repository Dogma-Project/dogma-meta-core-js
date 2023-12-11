import { IncomingMessage, ServerResponse } from "node:http";

export default function ResponseError(
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
  status: number,
  payload: {
    code?: number;
    message?: string;
  } = {}
) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
  });
  res.end(JSON.stringify(payload));
}
