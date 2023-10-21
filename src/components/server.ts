import Server from "../libs/server";
import connections from "./connection";
import { emit, services, subscribe } from "../libs/state";
import storage from "./storage";
import { Types } from "../types";
import connectionTester from "../libs/connectionTester";

const server = new Server(connections);

subscribe(["server"], (_action, state) => {
  services.router = state;
});

subscribe(
  ["server", "config-autoDefine", "config-external", "config-public_ipv4"],
  (_action, _state) => {
    const state = services.router;
    switch (state) {
      case Types.System.States.limited:
        connectionTester();
        break;
      case Types.System.States.full:
        emit("externalPort", storage.config.router);
        break;
    }
  }
);

/**
 * @todo add "config-bootstrap" dependency
 */
subscribe(
  ["config-router", "users", "node-key", "config-bootstrap"],
  (_action, _value, _type) => {
    const port = storage.config.router;
    if (!services.router) {
      server.listen(port);
    } else {
      server.refresh(port);
    }
  }
);
