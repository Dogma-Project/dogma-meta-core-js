import run from "./start";
import { createKeyPair } from "./modules/keys";
import { getArg, setArg } from "./modules/arguments";
import connections from "./components/connections";
import * as Model from "./components/model";
import * as Types from "./types";
declare const Keys: {
    createKeyPair: typeof createKeyPair;
};
declare const State: {
    stateManager: import("./modules/state").default;
    storage: import("./modules/storage").default;
};
declare const System: {
    run: typeof run;
    getArg: typeof getArg;
    setArg: typeof setArg;
};
export { System, Keys, State, Model, Types, connections as Connections };
