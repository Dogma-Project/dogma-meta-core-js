import WebSocket, { WebSocketServer } from "ws";
import logger from "../logger";
import generateSyncId from "../generateSyncId";
import { IncomingMessage } from "node:http";

interface DogmaWebSocket extends WebSocket {
  dogmaId: string;
}

export default class WebSocketApi {
  wss: WebSocketServer;

  connections: DogmaWebSocket[] = [];

  private minPort = 25600;
  private maxPort = 25999;

  public port: number = this.getRandomPort();

  /**
   *
   * @param port Enforce specific port for WS API
   */
  constructor(port?: number) {
    this.port = port || this.port;

    this.wss = new WebSocketServer({
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
    });

    logger.info("API", "Starting API at port", this.port);

    this.wss.on("connection", (ws: DogmaWebSocket, request: IncomingMessage) =>
      this.onConnect(ws, request)
    );

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

  private onConnect(ws: DogmaWebSocket, request: IncomingMessage) {
    ws.dogmaId = generateSyncId(6);
    logger.log("WS SOCKET", "connected", ws.dogmaId);
    ws.on("error", console.error);
    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });
    ws.send("something");
    ws.on("close", (code: number, reason: Buffer) => {
      logger.log("WS SOCKET", "closed", ws.dogmaId, reason.toString());
      this.connections = this.connections.filter(
        (s) => s.dogmaId !== ws.dogmaId
      );
    });
  }
}
