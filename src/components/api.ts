import { workerData } from "node:worker_threads";

import WebSocketApi from "../modules/api";
import stateManager from "./state";
import { C_API, C_Event } from "@dogma-project/constants-meta";
import logger from "../modules/logger";

const wsApi = new WebSocketApi(workerData.apiPort);

stateManager.subscribe([C_Event.Type.services], ([services]) => {
  wsApi.broadcast({
    type: C_API.ApiRequestType.services,
    action: C_API.ApiRequestAction.set,
    payload: {
      services,
    },
  });
});

export default wsApi;
