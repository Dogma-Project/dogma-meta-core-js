import { C_API } from "@dogma-project/constants-meta";
import { API } from "../../../types";
import logger from "../../logger";
import WorkerApi from "../index";
import createKey from "./keys/create";
import exportUserKey from "./keys/export";
import importUserKey from "./keys/import";

export default function KeysController(this: WorkerApi, data: API.Request) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      // export user key
      exportUserKey()
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.keys,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: res,
          });
        })
        .catch((err) => {
          logger.error("API KEYS", err);
          this.error({
            type: C_API.ApiRequestType.keys,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });

      break;
    case C_API.ApiRequestAction.push:
      // import user key
      this.response({
        type: C_API.ApiRequestType.keys,
        action: C_API.ApiRequestAction.result,
        id: data.id,
        payload: importUserKey(data.payload),
      });
      break;
    case C_API.ApiRequestAction.set:
      // create user or node key
      createKey(data.payload)
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.keys,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              result: true,
            },
          });
        })
        .catch((err) => {
          logger.error("API", "keys", err);
          this.error({
            type: C_API.ApiRequestType.keys,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      break;
    default:
      // error
      break;
  }
}
