import { events as EventEmitter, dgram } from "@dogma-project/core-host-api";
import * as Types from "../types";
import { getLocalAddress } from "./getLocalAddress";
import logger from "./logger";

/** @module LocalDiscovery */

class LocalDiscovery extends EventEmitter {
  private ip: string;
  private port: number;
  private broadcast: string;
  private server?: dgram.Socket;
  private ready: boolean = false;

  constructor({ port = 45432, ip = "0.0.0.0" }: { port: number; ip: string }) {
    super();
    const { address, broadcast } = getLocalAddress(ip);
    // this.ip = address;
    this.ip = "0.0.0.0";
    this.port = port;
    this.broadcast = broadcast;
  }

  public startServer() {
    this.server = dgram.createSocket({
      type: "udp4",
      reuseAddr: true,
    });
    this.server.on("listening", () => {
      this.ready = true;
      const address = this.server?.address();
      this.emit("ready", address);
    });
    this.server.on("message", (msg, from) => {
      // add validation
      const decoded = JSON.parse(msg.toString()) as Types.Discovery.Card;
      const { address } = from;
      const { type, user_id, node_id, port } = decoded;
      const response: Types.Discovery.Candidate = {
        type,
        user_id,
        node_id,
        local_ipv4: `${address}:${port}`,
      };
      this.emit("candidate", response);
    });
    this.server.on("error", (err) => {
      this.ready = false;
      this.emit("error", {
        type: "server",
        err,
      });
    });
    this.server.on("close", () => {
      this.ready = false;
      this.emit("stop", "ok");
    });

    this.server.bind(
      {
        port: this.port,
        address: this.ip,
      },
      () => {
        this.server?.setBroadcast(true);
      }
    );

    return this;
  }

  public stopServer() {
    this.server?.close();
  }

  /**
   * Announces current node in local network
   * @param card
   * @returns
   */
  public announce(card: Types.Discovery.Card) {
    const message = JSON.stringify(card);
    if (!this.ready) {
      return logger.warn(
        "Local Discovery",
        "Can't send discovery card. UDP server is stopped"
      );
    }
    this.server?.send(
      message,
      0,
      message.length,
      this.port,
      this.broadcast,
      (err, _bytes) => {
        if (err) {
          this.emit("error", {
            type: "client",
            err,
          });
        } else {
          logger.log("sent broadcast message to", this.broadcast, this.port);
        }
      }
    );
    return this;
  }
}

export default LocalDiscovery;
