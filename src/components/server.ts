import Server from "../modules/server";
import connections from "./connections";
import stateManager from "./state";
import storage from "./storage";
import { Types } from "../types";
import connectionTester from "../modules/connectionTester";

const server = new Server({ connections, storage, state: stateManager });

stateManager.subscribe([Types.Event.Type.server], (_action, state) => {
  stateManager.services.router = state;
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
        connectionTester();
        break;
      case Types.System.States.full:
        stateManager.emit(Types.Event.Type.externalPort, storage.config.router);
        break;
    }
  }
);

stateManager.subscribe(
  [
    Types.Event.Type.configRouter,
    Types.Event.Type.users,
    Types.Event.Type.nodeKey,
    Types.Event.Type.configDhtBootstrap,
  ],
  (_action, _value, _type) => {
    const port = storage.config.router;
    if (!stateManager.services.router) {
      server.listen(port);
    } else {
      server.refresh(port);
    }
  }
);
