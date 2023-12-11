import { System } from "../../types";

export default function ResponseOk(res: System.API.Response, payload: any) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}
