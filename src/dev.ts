import { C_API, C_Event, C_System } from "@dogma-project/constants-meta";
import RunWorker from "./run";
import logger from "./modules/logger";
import stateManager from "./components/state";

const worker = new RunWorker({
  prefix: process.env.prefix || "dev-0",
  auto: true,
  loglevel: C_System.LogLevel.info,
});
