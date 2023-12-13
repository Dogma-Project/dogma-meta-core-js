import WebSocket, { WebSocketServer } from "ws";

import logger from "../logger";
import generateSyncId from "../generateSyncId";
import { IncomingMessage } from "node:http";
import {
  KeysController,
  NetworkController,
  ServicesController,
  SettingsController,
  SystemController,
} from "./controllers";
import { API } from "../../types";
import { C_API } from "@dogma-project/constants-meta";

export default class WebSocketApi {
  wss: WebSocketServer;

  connections: API.DogmaWebSocket[] = [];

  public port: number;

  /**
   *
   * @param port Set specific port for WS API
   */
  constructor(port: number) {
    this.port = port;

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
        // parentPort?.postMessage({
        //   type: "api-port",
        //   action: "set",
        //   payload: this.port,
        // });
      }
    );

    this.wss.on("connection", this.onConnect);

    this.wss.on("error", (error: Error) => {
      console.error(error);
    });
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
        case C_API.ApiRequestType.services:
          ServicesController.call(ws, obj);
          break;
        case C_API.ApiRequestType.settings:
          SettingsController.call(ws, obj);
          break;
        case C_API.ApiRequestType.keys:
          KeysController.call(ws, obj);
          break;
        case C_API.ApiRequestType.network:
          NetworkController.call(ws, obj);
          break;
        case C_API.ApiRequestType.system:
          SystemController.call(ws, obj);
          break;
        default:
          // 404
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  public broadcast(data: API.ApiRequest) {
    this.connections.forEach((socket) => {
      socket.response(data);
    });
  }

  private socketOnError = (err: Error) => {
    logger.warn("WEB SOCKET", err);
  };
}
