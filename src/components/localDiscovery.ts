import LocalDiscovery from "../modules/localDiscovery";
import logger from "../modules/logger";
import stateManager from "./state";
import { DEFAULTS } from "../constants";
import * as Types from "../types";
import storage from "./storage";

const disc = new LocalDiscovery({
  port: DEFAULTS.LOCAL_DISCOVERY_PORT,
  ip: "",
});

stateManager.subscribe([Types.Event.Type.start], () => {
  disc.startServer();
  disc.on("ready", (data) => {
    // stateManager.services.localDiscovery = Types.System.States.full;
    logger.log("Local discovery server", "ready", data);
  });
  disc.on("error", (data) => {
    // stateManager.services.localDiscovery = Types.System.States.error;
    logger.error("Local discovery server", "error", data);
  });
});

stateManager.subscribe([Types.Event.Type.server], (payload) => {
  if (payload >= Types.System.States.limited) {
    const port = stateManager.state[Types.Event.Type.configRouter] as number;
    if (!port) return logger.warn("Local discovery", "Unknown port");
    disc.announce({
      type: "dogma-router",
      user_id: storage.user.id || "unk",
      node_id: storage.node.id || "unk",
      port,
    });
  }
});

export default disc;
