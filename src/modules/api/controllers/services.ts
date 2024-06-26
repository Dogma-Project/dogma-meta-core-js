import { API } from "../../../types";
import stateManager from "../../../components/state";
import { C_API, C_Event } from "../../../constants";
import WorkerApi from "../index";

export default function ServicesController(this: WorkerApi, data: API.Request) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      const services = stateManager.get(C_Event.Type.services);
      this.response({
        type: C_API.ApiRequestType.services,
        action: C_API.ApiRequestAction.set,
        id: data.id,
        payload: {
          services: services || [],
        },
      });
      break;
  }
}
