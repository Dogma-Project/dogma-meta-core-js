import LocalDiscovery from "../modules/localDiscovery";
import logger from "../modules/logger";
import { services } from "../modules/state-old";
import { DEFAULTS } from "../constants";
import { Types } from "../types";

const disc = new LocalDiscovery({
  port: DEFAULTS.LOCAL_DISCOVERY_PORT,
  ip: "",
});

disc.startServer();

disc.on("ready", (data) => {
  services.localDiscovery = Types.System.States.full;
  logger.log("Local discovery server", "ready", data);
});
disc.on("error", (data) => {
  services.localDiscovery = Types.System.States.error;
  logger.error("Local discovery server", "error", data);
});

export default disc;
