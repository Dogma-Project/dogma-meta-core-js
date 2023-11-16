import dgram from "node:dgram";
import EventEmitter from "node:events";
import * as Types from "../types";
import { getLocalAddress } from "./getLocalAddress";

/** @module LocalDiscovery */

class LocalDiscovery extends EventEmitter {
  ip: string;
  port: number;
  broadcast: string;
  server: dgram.Socket;

  constructor({ port = 45432, ip = "0.0.0.0" }: { port: number; ip: string }) {
    super();
    const { address, broadcast } = getLocalAddress(ip);
    // this.ip = address;
    this.ip = "0.0.0.0";
    this.port = port;
    this.broadcast = broadcast;
    this.server = dgram.createSocket({
      type: "udp4",
      reuseAddr: true,
    });
  }

  public startServer() {
    this.server.on("listening", () => {
      const address = this.server.address();
      this.emit("ready", {
        address,
      });
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
    this.server.on("error", (err) =>
      this.emit("error", {
        type: "server",
        err,
      })
    );

    this.server.bind(
      {
        port: this.port,
        address: this.ip,
      },
      () => {
        this.server.setBroadcast(true);
      }
    );

    return this;
  }

  public announce(card: Types.Discovery.Card) {
    const message = JSON.stringify(card);
    this.server.send(
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
          console.log("sent broadcast message to", this.broadcast, this.port);
        }
      }
    );
    return this;
  }
}

export default LocalDiscovery;
