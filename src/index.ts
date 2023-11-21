import { createKeyPair } from "./modules/keys";

import stateManager from "./components/state";
import storage from "./components/storage";
import { configModel } from "./components/model";

const { persistConfig } = configModel;

const Keys = {
  createKeyPair,
};
const State = {
  stateManager,
  storage,
};
const Model = {
  persistConfig,
};

export { Keys, State, Model };
