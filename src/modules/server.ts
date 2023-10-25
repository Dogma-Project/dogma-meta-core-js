import net from "node:net";
import logger from "./logger";
import * as Types from "../types";
import Connections from "./connections";
import StateManager from "./state";
import Storage from "./storage";

/** @module Server */

export default class Server {
  connectionsBridge: Connections;
  stateBridge: StateManager;
  storageBridge: Storage;

  ss: net.Server | null = null;
  port: number = 0;

  constructor({
    connections,
    state,
    storage,
  }: {
    connections: Connections;
    state: StateManager;
    storage: Storage;
  }) {
    this.connectionsBridge = connections;
    this.stateBridge = state;
    this.storageBridge = storage;
  }

  listen(port: number) {
    this.port = port;

    this.ss = net.createServer({}, (socket) => {
      const host = socket.remoteAddress || "127.0.0.1"; // edit
      const port = socket.remotePort || 0; // edit
      const peer: Types.Connection.Peer = {
        host,
        port,
        address: host + port,
        version: 4,
      };
      this.connectionsBridge.onConnect(socket, peer);
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
      this.stateBridge.emit(
        Types.Event.Type.server,
        Types.System.States.limited
      );
    });

    this.ss.on("error", (error) => {
      this.stateBridge.emit(Types.Event.Type.server, Types.System.States.error);
      logger.error("server", "SERVER ERROR", error);
    });

    this.ss.on("close", () => {
      logger.log("server", "SOCKET SERVER CLOSED");
    });
  }

  stop(cb: Function) {
    this.stateBridge.emit(
      Types.Event.Type.server,
      Types.System.States.disabled
    );
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
}
