import Server from "../modules/server";
import connections from "./connections";
import stateManager from "./state";
import storage from "./storage";
import * as Types from "../types";
import logger from "../modules/logger";
import client from "./client";
import { getArg } from "../modules/arguments";
import dht from "./dht";

const server = new Server({ connections, storage, state: stateManager });

stateManager.subscribe(
  [
    Types.Event.Type.server,
    Types.Event.Type.configRouter,
    Types.Event.Type.configAutoDefine,
    Types.Event.Type.configExternal,
    // Types.Event.Type.configPublicIpV4,
  ],
  ([server, configRouter]) => {
    switch (server) {
      case Types.System.States.limited:
        const ipv4 =
          stateManager.state[Types.Event.Type.configPublicIpV4] || "8.8.8.8"; // edit
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
            stateManager.emit(
              Types.Event.Type.server,
              Types.System.States.full
            );
          } else {
            stateManager.emit(Types.Event.Type.server, Types.System.States.ok);
          }
        });
        break;
      case Types.System.States.ok:
        logger.log("Server", "server is under NAT");
        break;
      case Types.System.States.full:
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
    Types.Event.Type.configRouter,
    Types.Event.Type.storageNode,
    Types.Event.Type.storageUser,
  ],
  ([configRouter]) => {
    logger.log("DEBUG", "Server start");
    const forced = getArg(Types.System.Args.port);
    if (forced) logger.log("SERVER", "forced to port", forced);
    server.start(forced || configRouter);
  }
);

stateManager.subscribe(
  [
    Types.Event.Type.server,
    Types.Event.Type.configRouter,
    Types.Event.Type.configDhtAnnounce,
  ],
  ([server, configRouter]) => {
    if (
      server === Types.System.States.ok ||
      server === Types.System.States.full
    ) {
      const forced = getArg(Types.System.Args.port);
      dht.announce(forced || configRouter);
    }
  }
);
