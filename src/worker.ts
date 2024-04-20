import worker from "node:worker_threads";
import process from "node:process";
import { C_Event } from "./constants";
import stateManager from "./components/state";
import "./modules/prototypes";
import "./components/server";
import "./components/client";
import "./components/keys";
import "./components/model";
import "./components/homedir";
import "./components/api";
import "./components/sync";

process.title = `Dogma Meta ${worker.workerData.prefix}`;
stateManager.enforce(C_Event.Type.start);
