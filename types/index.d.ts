import "./start";
import { createKeyPair } from "./modules/keys";
import * as Model from "./components/model";
declare const Keys: {
    createKeyPair: typeof createKeyPair;
};
declare const State: {
    stateManager: import("./modules/state").default;
    storage: import("./modules/storage").default;
};
export { Keys, State, Model };
