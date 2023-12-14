import { C_API, C_System } from "@dogma-project/constants-meta";
import RunWorker from "./run";
import logger from "./modules/logger";

const worker = new RunWorker({
  prefix: process.env.prefix || "dev-0",
  auto: true,
  loglevel: C_System.LogLevel.info,
});

worker.on("notify", (data) => {
  if (data.type === C_API.ApiRequestType.system) {
    logger.debug("NOTIFY 1", data);
  }
});

worker.send({
  type: C_API.ApiRequestType.system,
  action: C_API.ApiRequestAction.get,
});
