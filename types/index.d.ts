import "./start";
import { createKeyPair } from "./modules/keys";
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
export { Keys, State, Model, Types, connections as Connections };
