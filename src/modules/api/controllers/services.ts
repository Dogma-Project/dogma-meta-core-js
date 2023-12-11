import { API } from "../../../types";
import stateManager from "../../../components/state";
import { C_Event } from "@dogma-project/constants-meta";

export default function ServicesController(
  this: API.DogmaWebSocket,
  data: API.ApiRequest
) {
  switch (data.action) {
    case API.ApiRequestAction.get:
      const services = stateManager.state[C_Event.Type.services];
      this.response({
        type: API.ApiRequestType.services,
        action: API.ApiRequestAction.set,
        payload: {
          services: services || [],
        },
      });
      break;
  }
}
