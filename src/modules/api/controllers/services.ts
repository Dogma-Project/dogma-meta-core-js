import { API } from "../../../types";
import stateManager from "../../../components/state";
import { C_API, C_Event } from "@dogma-project/constants-meta";

export default function ServicesController(
  this: API.DogmaWebSocket,
  data: API.ApiRequest
) {
  switch (data.action) {
    case C_API.ApiRequestAction.get:
      const services = stateManager.get(C_Event.Type.services);
      this.response({
        type: C_API.ApiRequestType.services,
        action: C_API.ApiRequestAction.set,
        payload: {
          services: services || [],
        },
      });
      break;
  }
}
