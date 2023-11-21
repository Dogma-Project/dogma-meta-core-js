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
    stateManager.emit(
      Types.Event.Type.localDiscovery,
      Types.System.States.full
    );
    logger.log("Local discovery server", "ready", data);
  });
  disc.on("error", (data) => {
    stateManager.emit(
      Types.Event.Type.localDiscovery,
      Types.System.States.error
    );
    logger.error("Local discovery server", "error", data);
  });
});

stateManager.subscribe(
  [Types.Event.Type.server, Types.Event.Type.configRouter],
  ([server, configRouter]) => {
    if (server >= Types.System.States.limited) {
      if (!configRouter) return logger.warn("Local discovery", "Unknown port");
      disc.announce({
        type: "dogma-router",
        user_id: storage.user.id || "unk",
        node_id: storage.node.id || "unk",
        port: configRouter,
      });
    }
  }
);

export default disc;
