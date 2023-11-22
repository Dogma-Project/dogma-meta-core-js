import "./start";
import { createKeyPair } from "./modules/keys";

import stateManager from "./components/state";
import storage from "./components/storage";
import connections from "./components/connections";
import * as Model from "./components/model"; // check
import * as Types from "./types";

const Keys = {
  createKeyPair,
};
const State = {
  stateManager,
  storage,
};

export { Keys, State, Model, Types, connections as Connections };
