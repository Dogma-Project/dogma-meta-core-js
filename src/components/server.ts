import Server from "../modules/server";
import connections from "./connections";
import stateManager from "./state";
import storage from "./storage";
import { Types } from "../types";
import connectionTester from "../modules/connectionTester";

const server = new Server({ connections, storage, state: stateManager });

stateManager.subscribe(["server"], (_action, state) => {
  stateManager.services.router = state;
});

stateManager.subscribe(
  ["server", "config-autoDefine", "config-external", "config-public_ipv4"],
  (_action, _state) => {
    const state = stateManager.services.router;
    switch (state) {
      case Types.System.States.limited:
        connectionTester();
        break;
      case Types.System.States.full:
        stateManager.emit("externalPort", storage.config.router);
        break;
    }
  }
);

/**
 * @todo add "config-bootstrap" dependency
 */
stateManager.subscribe(
  ["config-router", "users", "node-key", "config-bootstrap"],
  (_action, _value, _type) => {
    const port = storage.config.router;
    if (!stateManager.services.router) {
      server.listen(port);
    } else {
      server.refresh(port);
    }
  }
);
