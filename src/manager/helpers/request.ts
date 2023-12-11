import { IncomingMessage } from "node:http";
import { System } from "../../types";

export default function Request(req: IncomingMessage): System.API.Request {
  const { url, method, headers } = req;
  if (!url || !method) throw "bad request";
  const parsed = new URL(url, "http://localhost/");
  const { pathname, searchParams } = parsed;
  const splittedPath = pathname.split("/").filter((i) => !!i);
  return {
    path: splittedPath,
    query: searchParams,
    method,
  };
}
