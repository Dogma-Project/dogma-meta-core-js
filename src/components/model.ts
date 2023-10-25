import state from "./state";
import { DHTModel } from "../modules/model";
import stateManager from "./state";
import { Event } from "../types";

const dhtModel = new DHTModel({ state });

stateManager.subscribe([Event.Type.start], () => {
  dhtModel.init();
});

export { dhtModel };
