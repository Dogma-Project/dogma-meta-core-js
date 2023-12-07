import { C_Event, C_System } from "@dogma-project/constants-meta";
import LocalDiscovery from "../modules/localDiscovery";
import logger from "../modules/logger";
import stateManager from "./state";
import { DEFAULTS } from "../constants";
import storage from "./storage";

const disc = new LocalDiscovery({
  port: DEFAULTS.LOCAL_DISCOVERY_PORT,
  ip: "",
});
disc.on("ready", (data) => {
  stateManager.emit(C_Event.Type.localDiscovery, C_System.States.full);
  logger.info("Local discovery server", "ready", data);
});
disc.on("error", (data) => {
  stateManager.emit(C_Event.Type.localDiscovery, C_System.States.error);
  logger.error("Local discovery server", "error", data);
});
disc.on("stop", () => {
  stateManager.emit(C_Event.Type.localDiscovery, C_System.States.disabled);
  logger.info("Local discovery server", "stopped");
});

stateManager.subscribe(
  [C_Event.Type.configLocalDiscovery, C_Event.Type.start],
  ([configLocalDiscovery]) => {
    if (!!configLocalDiscovery) {
      disc.startServer();
    } else {
      disc.stopServer();
    }
  }
);

stateManager.subscribe(
  [C_Event.Type.server, C_Event.Type.configRouter, C_Event.Type.localDiscovery],
  ([server, configRouter, localDiscovery]) => {
    if (
      server >= C_System.States.limited &&
      localDiscovery === C_System.States.full
    ) {
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
