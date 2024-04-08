import net from "node:net";
import logger from "./logger";
import * as Types from "../types";
import Connections from "./connections";
import StateManager from "./state";
import Storage from "./storage";
import { C_Connection, C_Event, C_System } from "../constants";
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

  private listen(port: number) {
    this.port = port;

    this.ss = net.createServer({}, (socket) => {
      const host = socket.remoteAddress || "127.0.0.1"; // edit
      const port = socket.remotePort || 0; // edit
      const peer: Types.Connection.Peer = {
        host,
        port,
        address: host + ":" + port,
        version: 4,
      };
      this.connectionsBridge.onConnect(
        socket,
        peer,
        C_Connection.Direction.incoming
      );
    });

    const host = "0.0.0.0"; // temp
    this.ss.listen(port, host, () => {
      logger.info("server", `TCP socket is listening on ${host}:${port}`);
      this.storageBridge.node.router_port = port;
      this.stateBridge.emit(C_Event.Type.server, C_System.States.limited);
    });

    this.ss.on("error", (error) => {
      this.stateBridge.emit(C_Event.Type.server, C_System.States.error);
      logger.error("server", "SERVER ERROR", error);
    });

    this.ss.on("close", () => {
      logger.log("server", "SOCKET SERVER CLOSED");
    });
  }

  private refresh(port: number) {
    this.stateBridge.emit(C_Event.Type.server, C_System.States.disabled);
    this.ss && this.ss.close();
    return this.listen(port);
  }

  start(port: number) {
    if (this.ss === null) {
      this.listen(port);
    } else if (port !== this.port) {
      this.refresh(port);
    } else {
      logger.info("Server", "start", "nothing to do");
    }
  }
}
