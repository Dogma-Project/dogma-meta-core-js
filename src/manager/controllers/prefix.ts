import { IncomingMessage, ServerResponse } from "node:http";
import { System } from "../../types";
import ResponseError from "../responses/error";
import RunWorker from "../../run";
import { C_System } from "@dogma-project/constants-meta";
import ResponseOk from "../responses/ok";

const workers: {
  [key: string]: RunWorker;
} = {};

function get(req: System.API.Request, res: System.API.Response) {
  const prefix = req.path[1];
  if (prefix in workers) {
    ResponseOk(res, {
      api: workers[prefix].apiPort || null,
    });
  } else {
    ResponseError(res, 402, { message: "Instance is not ready" });
  }
}

function put(req: System.API.Request, res: System.API.Response) {
  const prefix = req.path[1];
  if (!(prefix in workers)) {
    const apiport = undefined; // edit
    workers[prefix] = new RunWorker({
      apiPort: apiport,
      prefix,
      loglevel: C_System.LogLevel.logs, // edit
    });
    ResponseOk(res, {
      api: apiport || workers[prefix].apiPort || null, // edit
    });
  } else {
    ResponseError(res, 402, { message: "Instance is already running" });
  }
}

export default function PrefixController(
  req: System.API.Request,
  res: System.API.Response
) {
  const prefix = req.path[1];
  if (prefix) {
    if (prefix.length >= 3) {
      switch (req.method) {
        case "GET":
          get(req, res);
          break;
        case "PUT":
          put(req, res);
          break;
        default:
          ResponseError(res, 405, { message: "Method not allowed" });
          break;
      }
    } else {
      ResponseError(res, 400, { message: "Prefix is too short" });
    }
  } else {
    ResponseError(res, 404, { message: "Invalid prefix" });
  }
}
