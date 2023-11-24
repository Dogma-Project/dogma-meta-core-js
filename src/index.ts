import run from "./start";
import { createKeyPair } from "./modules/keys";
import { getArg, setArg } from "./modules/arguments";

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
const System = {
  run,
  getArg,
  setArg,
};

export { System, Keys, State, Model, Types, connections as Connections };
