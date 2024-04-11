import WorkerApi from "../modules/api";
import stateManager from "./state";
import { C_API, C_Event } from "../constants";

const wApi = new WorkerApi();

stateManager.subscribe([C_Event.Type.services], ([services]) => {
  wApi.notify({
    type: C_API.ApiRequestType.services,
    action: C_API.ApiRequestAction.set,
    payload: {
      services,
    },
  });
});

export default wApi;
