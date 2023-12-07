import Server from "../modules/server";
import connections from "./connections";
import stateManager from "./state";
import storage from "./storage";
import * as Types from "../types";
import logger from "../modules/logger";
import client from "./client";
import { getArg } from "../modules/arguments";
import dht from "./dht";
import { C_Event, C_System } from "@dogma-project/constants-meta";
const server = new Server({ connections, storage, state: stateManager });

stateManager.subscribe(
  [
    C_Event.Type.server,
    C_Event.Type.configRouter,
    C_Event.Type.configAutoDefine,
    C_Event.Type.configExternal,
    // C_Event.Type.configPublicIpV4,
  ],
  ([server, configRouter]) => {
    switch (server) {
      case C_System.States.limited:
        const ipv4 =
          stateManager.state[C_Event.Type.configPublicIpV4] || "8.8.8.8"; // edit
        const port = configRouter || 12345; // edit
        const peer: Types.Connection.Peer = {
          host: ipv4,
          port,
          address: `${ipv4}:${port}`,
          public: true,
          version: 4,
        };
        client.test(peer, (res) => {
          if (res) {
            stateManager.emit(C_Event.Type.server, C_System.States.full);
          } else {
            stateManager.emit(C_Event.Type.server, C_System.States.ok);
          }
        });
        break;
      case C_System.States.ok:
        logger.log("Server", "server is under NAT");
        break;
      case C_System.States.full:
        /**
         * @todo save port to db
         */
        logger.log("Server", "port is open");
        break;
    }
  }
);

stateManager.subscribe(
  [
    C_Event.Type.configRouter,
    C_Event.Type.storageNode,
    C_Event.Type.storageUser,
  ],
  ([configRouter]) => {
    logger.log("DEBUG", "Server start");
    const forced = getArg(C_System.Args.port);
    if (forced) logger.log("SERVER", "forced to port", forced);
    server.start(forced || configRouter);
  }
);

stateManager.subscribe(
  [
    C_Event.Type.server,
    C_Event.Type.configRouter,
    C_Event.Type.configDhtAnnounce,
  ],
  ([server, configRouter]) => {
    if (server === C_System.States.ok || server === C_System.States.full) {
      const forced = getArg(C_System.Args.port);
      dht.announce(forced || configRouter);
    }
  }
);
