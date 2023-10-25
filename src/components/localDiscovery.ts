import LocalDiscovery from "../modules/localDiscovery";
import logger from "../modules/logger";
import stateManager from "./state";
import { DEFAULTS } from "../constants";
import * as Types from "../types";

const disc = new LocalDiscovery({
  port: DEFAULTS.LOCAL_DISCOVERY_PORT,
  ip: "",
});

stateManager.subscribe([Types.Event.Type.start], () => {
  disc.startServer();
  disc.on("ready", (data) => {
    stateManager.services.localDiscovery = Types.System.States.full;
    logger.log("Local discovery server", "ready", data);
  });
  disc.on("error", (data) => {
    stateManager.services.localDiscovery = Types.System.States.error;
    logger.error("Local discovery server", "error", data);
  });
});

export default disc;
