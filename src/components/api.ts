import WorkerApi from "../modules/api";
import stateManager from "./state";
import { C_API, C_Event } from "@dogma-project/constants-meta";

const wsApi = new WorkerApi();

stateManager.subscribe([C_Event.Type.services], ([services]) => {
  wsApi.notify({
    type: C_API.ApiRequestType.services,
    action: C_API.ApiRequestAction.set,
    payload: {
      services,
    },
  });
});

export default wsApi;
