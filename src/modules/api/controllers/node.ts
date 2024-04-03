import { C_API } from "../../../types/constants";
import { API } from "../../../types";
import logger from "../../logger";
import WorkerApi from "../index";
import GetNode from "./node/get";
import DeleteNode from "./node/del";
import EditNode from "./node/edit";

export default function NodeController(this: WorkerApi, data: API.Request) {
  logger.debug("API", "[NODE]", data);
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      // get node by node_id or own
      GetNode(data.payload)
        .then((res) => {
          this.response({
            type: C_API.ApiRequestType.node,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: res,
          });
        })
        .catch((err) => {
          logger.error("API NODE", err);
          this.error({
            type: C_API.ApiRequestType.node,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      break;
    case C_API.ApiRequestAction.set:
      // update node data by node_id
      EditNode(data.payload)
        .then(({ numAffected }) => {
          this.response({
            type: C_API.ApiRequestType.node,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              edited: numAffected,
            },
          });
        })
        .catch((err) => {
          logger.error("API NODE", err);
          this.error({
            type: C_API.ApiRequestType.node,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      break;
    case C_API.ApiRequestAction.delete:
      DeleteNode(data.payload)
        .then(({ numAffected }) => {
          this.response({
            type: C_API.ApiRequestType.node,
            action: C_API.ApiRequestAction.result,
            id: data.id,
            payload: {
              deleted: numAffected,
            },
          });
        })
        .catch((err) => {
          logger.error("API NODE", err);
          this.error({
            type: C_API.ApiRequestType.node,
            action: C_API.ApiRequestAction.error,
            id: data.id,
            payload: err,
          });
        });
      // delete node by node_id
      break;
    default:
      // error
      break;
  }
}
