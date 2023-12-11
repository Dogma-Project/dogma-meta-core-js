import { System } from "../../types";
import ResponseError from "../responses/error";
import GetPrefixes from "../helpers/get-prefixes";
import ResponseOk from "../responses/ok";
import DelPrefix from "../helpers/del-prefix";

function get(req: System.API.Request, res: System.API.Response) {
  GetPrefixes()
    .then((arr) => {
      ResponseOk(res, arr);
    })
    .catch((err) => {
      ResponseError(res, 500, { message: "Can't get prefixes" });
    });
}

function del(req: System.API.Request, res: System.API.Response) {
  const prefix = req.path[1];
  if (!prefix) {
    return ResponseError(res, 400, {
      message: "Prefix is empty",
    });
  }
  DelPrefix(prefix)
    .then(() => {
      ResponseOk(res, {
        result: true,
      });
    })
    .catch((err) => {
      ResponseError(res, 500, { message: "Can't delete prefix" });
    });
}

export default function PrefixesController(
  req: System.API.Request,
  res: System.API.Response
) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "DELETE":
      del(req, res);
      break;
    default:
      ResponseError(res, 405, { message: "Method not allowed" });
      break;
  }
}
