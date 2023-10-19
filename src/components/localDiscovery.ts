import LocalDiscovery from "../libs/localDiscovery";
import logger from "../libs/logger";
import { services } from "../libs/state";
import { DEFAULTS, STATES } from "../constants";

const disc = new LocalDiscovery({
  port: DEFAULTS.LOCAL_DISCOVERY_PORT,
  ip: "",
});

disc.startServer();

disc.on("ready", (data) => {
  services.localDiscovery = STATES.FULL;
  logger.log("Local discovery server", "ready", data);
});
disc.on("error", (data) => {
  services.localDiscovery = STATES.ERROR;
  logger.error("Local discovery server", "error", data);
});

export default disc;
