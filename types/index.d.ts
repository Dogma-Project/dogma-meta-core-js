import { createKeyPair } from "./modules/keys";
declare const Keys: {
    createKeyPair: typeof createKeyPair;
};
declare const State: {
    stateManager: import("./modules/state").default;
    storage: import("./modules/storage").default;
};
declare const Model: {
    persistConfig: (config: import("./types/config").default.Model) => Promise<void>;
};
export { Keys, State, Model };
