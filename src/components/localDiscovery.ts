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
disc.on("ready", (data) => {
  stateManager.emit(Types.Event.Type.localDiscovery, Types.System.States.full);
  logger.info("Local discovery server", "ready", data);
});
disc.on("error", (data) => {
  stateManager.emit(Types.Event.Type.localDiscovery, Types.System.States.error);
  logger.error("Local discovery server", "error", data);
});
disc.on("stop", () => {
  stateManager.emit(
    Types.Event.Type.localDiscovery,
    Types.System.States.disabled
  );
  logger.info("Local discovery server", "stopped");
});

stateManager.subscribe(
  [Types.Event.Type.configLocalDiscovery, Types.Event.Type.start],
  ([configLocalDiscovery]) => {
    if (!!configLocalDiscovery) {
      disc.startServer();
    } else {
      disc.stopServer();
    }
  }
);

stateManager.subscribe(
  [
    Types.Event.Type.server,
    Types.Event.Type.configRouter,
    Types.Event.Type.localDiscovery,
  ],
  ([server, configRouter, localDiscovery]) => {
    if (
      server >= Types.System.States.limited &&
      localDiscovery === Types.System.States.full
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
