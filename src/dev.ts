import RunWorker from "./run";
import logger from "./modules/logger";
import { C_System } from "./constants";
import testFunction from "@dogma-project/core-host-api";

testFunction("mda");

logger.info("START", "Running prefix", process.env.prefix);
const worker = new RunWorker({
  prefix: process.env.prefix || "dev-0",
  auto: true,
  loglevel: C_System.LogLevel.info,
});
