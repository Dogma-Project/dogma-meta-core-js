import { workerData } from "node:worker_threads";
import process from "node:process";
import { C_Event } from "@dogma-project/constants-meta";
import stateManager from "./components/state";
import "./modules/prototypes";
import "./components/server";
import "./components/client";
import "./components/keys";
import "./components/model";
import "./components/homedir";
import "./components/api";

process.title = `Dogma Meta ${global.prefix}`;
global.prefix = workerData.prefix;
stateManager.enforce(C_Event.Type.start);
