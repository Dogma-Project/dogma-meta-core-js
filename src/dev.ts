import { C_System } from "@dogma-project/constants-meta";
import RunWorker from "./run";

import logger from "./modules/logger";

logger.info("START", "Running prefix", process.env.prefix);
const worker = new RunWorker({
  prefix: process.env.prefix || "dev-0",
  auto: true,
  loglevel: C_System.LogLevel.info,
});
