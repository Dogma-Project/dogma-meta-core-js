import "./start";
import { createKeyPair } from "./modules/keys";

import stateManager from "./components/state";
import storage from "./components/storage";
import * as Model from "./components/model"; // check

const Keys = {
  createKeyPair,
};
const State = {
  stateManager,
  storage,
};

export { Keys, State, Model };
