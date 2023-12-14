import { C_API, C_System } from "@dogma-project/constants-meta";
import RunWorker from "./run";
import logger from "./modules/logger";

const worker = new RunWorker({
  prefix: process.env.prefix || "dev-0",
  auto: true,
  loglevel: C_System.LogLevel.info,
});

worker.on("notify", (data) => {
  // logger.debug("NOTIFY 1", data);
});
