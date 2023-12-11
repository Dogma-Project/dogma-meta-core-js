import { parentPort } from "node:worker_threads";
import WebSocket, { WebSocketServer } from "ws";

import logger from "../logger";
import generateSyncId from "../generateSyncId";
import { IncomingMessage } from "node:http";
import {
  KeysController,
  NetworkController,
  ServicesController,
  SettingsController,
} from "./controllers";
import { API } from "../../types";

export default class WebSocketApi {
  wss: WebSocketServer;

  connections: API.DogmaWebSocket[] = [];

  private minPort = 25600;
  private maxPort = 25999;

  public port: number = this.getRandomPort();

  /**
   *
   * @param port Enforce specific port for WS API
   */
  constructor(port?: number) {
    this.port = port || this.port;

    this.wss = new WebSocketServer(
      {
        port: this.port,
        perMessageDeflate: {
          zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
          },
          zlibInflateOptions: {
            chunkSize: 10 * 1024,
          },
          clientNoContextTakeover: true,
          serverNoContextTakeover: true,
          serverMaxWindowBits: 10,
          concurrencyLimit: 10,
          threshold: 1024,
        },
      },
      () => {
        logger.info("API", "WS API started on port:", this.port);
        parentPort?.postMessage({
          type: "api-port",
          action: "set",
          payload: this.port,
        });
      }
    );

    this.wss.on("connection", this.onConnect);

    this.wss.on("error", (error: Error) => {
      console.error(error);
    });
  }

  private getRandomPort() {
    return (
      Math.floor(Math.random() * (this.maxPort - this.minPort + 1)) +
      this.minPort
    );
  }

  private onConnect = (ws: API.DogmaWebSocket, request: IncomingMessage) => {
    ws.dogmaId = generateSyncId(6);
    ws.response = (request: API.ApiRequest) => {
      ws.send(JSON.stringify(request));
    };
    // ws.errorresponse = () => {

    // }
    logger.log("WS SOCKET", "connected", ws.dogmaId);
    ws.on("error", this.socketOnError);
    ws.on("message", this.socketOnMessage);
    ws.on("close", (code: number, reason: Buffer) => {
      logger.log("WS SOCKET", "closed", ws.dogmaId, reason.toString());
      this.connections = this.connections.filter(
        (s) => s.dogmaId !== ws.dogmaId
      );
    });
  };

  private socketOnMessage(data: WebSocket.RawData) {
    try {
      const ws = this as unknown as API.DogmaWebSocket; // edit
      const obj = JSON.parse(data.toString()) as API.ApiRequest;
      switch (obj.type) {
        case API.ApiRequestType.services:
          ServicesController.call(ws, obj);
          break;
        case API.ApiRequestType.settings:
          SettingsController.call(ws, obj);
          break;
        case API.ApiRequestType.keys:
          KeysController.call(ws, obj);
          break;
        case API.ApiRequestType.network:
          NetworkController.call(ws, obj);
          break;
        default:
          // 405
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  private socketOnError = (err: Error) => {
    logger.warn("WEB SOCKET", err);
  };
}
