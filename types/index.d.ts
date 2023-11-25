import run from "./start";
import { createKeyPair } from "./modules/keys";
import { getArg } from "./modules/arguments";
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
    logger: {
        error: (type: string, ...message: any) => void;
        warn: (type: string, ...message: any) => void;
        info: (type: string, ...message: any) => void;
        log: (type: string, ...message: any) => void;
        debug: (type: string, ...message: any) => void;
    };
};
export { System, Keys, State, Model, Types, connections as Connections };
