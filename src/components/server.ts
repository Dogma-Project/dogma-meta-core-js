import Server from "../modules/server";
import connections from "./connections";
import stateManager from "./state";
import storage from "./storage";
import * as Types from "../types";
import logger from "../modules/logger";
// import connectionTester from "../modules/connectionTester";

const server = new Server({ connections, storage, state: stateManager });

stateManager.subscribe([Types.Event.Type.server], (value) => {
  stateManager.services.router = value;
});

stateManager.subscribe(
  [
    Types.Event.Type.server,
    Types.Event.Type.configAutoDefine,
    Types.Event.Type.configExternal,
    Types.Event.Type.configPublicIpV4,
  ],
  (_action, _state) => {
    const state = stateManager.services.router;
    switch (state) {
      case Types.System.States.limited:
        // connectionTester();
        break;
      case Types.System.States.full:
        stateManager.emit(
          Types.Event.Type.externalPort,
          stateManager.state[Types.Event.Type.configRouter]
        );
        break;
    }
  }
);

stateManager.subscribe(
  [
    Types.Event.Type.configRouter,
    Types.Event.Type.nodeKey,
    Types.Event.Type.masterKey,
  ],
  () => {
    logger.log("DEBUG", "Server start");
    const port = stateManager.state[Types.Event.Type.configRouter];
    // edit
    if (!stateManager.services.router) {
      server.listen(port);
    } else {
      server.refresh(port);
    }
  }
);
