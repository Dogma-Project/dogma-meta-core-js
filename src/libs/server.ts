import net from "node:net";
import logger from "./logger";
import { store } from "./main";
import { state, emit } from "./state";
import LocalDiscovery from "../components/localDiscovery";
// import dht from "../components/dht";
import args from "../components/arguments";
import Connection from "./connection";
import { Types } from "../types";
// import { Types } from "../types";

/** @module Server */

export default class Server {
  connectionBridge: Connection;
  ss: net.Server | null = null;
  port: number = 0;

  constructor(connection: Connection) {
    this.connectionBridge = connection;
  }

  listen(port: number) {
    this.port = port;

    this.ss = net.createServer({}, (socket) => {
      const peer = {
        host: socket.remoteAddress || "unk",
        port: socket.remotePort || 0,
      };
      this.connectionBridge.onConnect(socket, peer);
    });

    const host = "0.0.0.0"; // temp
    this.ss.listen(port, host, () => {
      logger.info("server", `TLS socket is listening on ${host}:${port}`);
      /**
       * @todo move from here
       */
      /*
      setTimeout(() => {
        const {
          user: { id: user_id },
          node: { id: node_id },
        } = store;
        const card = {
          type: "dogma-router",
          user_id,
          node_id,
          port,
        };
        LocalDiscovery.announce(card);
        dht.announce(port);
      }, 3000);
      */
      emit("server", Types.System.States.limited);
    });

    this.ss.on("error", (error) => {
      emit("server", Types.System.States.error);
      logger.error("server", "SERVER ERROR", error);
    });

    this.ss.on("close", () => {
      logger.log("server", "SOCKET SERVER CLOSED");
    });
  }

  stop(cb: Function) {
    emit("server", Types.System.States.disabled);
    this.ss && this.ss.close();
    cb();
  }

  refresh(port: number) {
    if (port !== this.port) {
      this.stop(() => {
        this.listen(port);
      });
    } else {
      console.log("do nothing");
      // this.ss && this.ss.setSecureContext(getOptions());
    }
  }

  /**
   * Allows unauthorized server connections
   * @returns {Boolean}
   * @todo check how args.discovery allows ALL permission
   */
  permitUnauthorized() {
    const cond1 = !!args.discovery;
    const cond2 = state["config-bootstrap"] === Types.Connection.Group.all;
    return cond1 || cond2;
  }
}
