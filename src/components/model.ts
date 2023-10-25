import state from "./state";
import { DHTModel } from "../modules/model";

const dhtModel = new DHTModel({ state });
dhtModel.init();

export { dhtModel };
