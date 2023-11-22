import "./start";
import { createKeyPair } from "./modules/keys";
import * as Model from "./components/model";
import * as Types from "./types";
declare const Keys: {
    createKeyPair: typeof createKeyPair;
};
declare const State: {
    stateManager: import("./modules/state").default;
    storage: import("./modules/storage").default;
};
export { Keys, State, Model, Types };
