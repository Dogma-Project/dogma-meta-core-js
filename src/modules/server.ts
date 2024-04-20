import WebSocket from "websocket";
import http from "node:http";
import logger from "./logger";
import Connections from "./connections";
import StateManager from "./state";
import Storage from "./storage";
import { C_Connection, C_Event, C_System } from "../constants";

/** @module Server */

export default class Server {
  connectionsBridge: Connections;
  stateBridge: StateManager;
  storageBridge: Storage;

  ss: WebSocket.server | null = null;
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

    const httpServer = http.createServer((request, response) => {
      console.log(new Date() + " Received request for " + request.url);
      response.writeHead(404);
      response.end();
    });
    httpServer.listen(this.port, "0.0.0.0", () => {
      logger.info("server", `Websocket is listening on port ${port}`);
      this.storageBridge.node.router_port = port;
      this.stateBridge.emit(C_Event.Type.server, C_System.States.limited);
    });
    httpServer.on("error", (error) => {
      this.stateBridge.emit(C_Event.Type.server, C_System.States.error);
      logger.error("server", "SERVER ERROR", error);
    });
    httpServer.on("close", () => {
      logger.log("server", "SOCKET SERVER CLOSED");
    });

    this.ss = new WebSocket.server({
      httpServer,
      autoAcceptConnections: true, // check
    });

    this.ss.on("request", (request) => {
      const connection = request.accept(); // add protocol
      const address = connection.remoteAddress || "127.0.0.1"; // edit
      const peer = this.connectionsBridge.peerFromIP(address);
      logger.debug("PEER", peer);
      this.connectionsBridge.onConnect(
        connection,
        peer,
        C_Connection.Direction.incoming
      );
    });
  }

  private refresh(port: number) {
    this.stateBridge.emit(C_Event.Type.server, C_System.States.disabled);
    this.ss && this.ss.shutDown(); // test
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
