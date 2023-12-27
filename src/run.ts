import { C_API, C_System } from "@dogma-project/constants-meta";
import { Worker } from "node:worker_threads";
import { EventEmitter } from "node:stream";
import generateSyncId from "./modules/generateSyncId";
import { API } from "./types";
// import logger from "./modules/logger";

interface WorkerData {
  prefix: string;
  /**
   * enforces router port ignoring settings
   */
  routerPort?: number;
  /**
   * auto generate node. default: false
   */
  auto?: boolean;
  /**
   * force node to run as passive discovery server. default: false
   */
  discovery?: boolean;
  /**
   * sets log level. default: C_System.LogLevel.info
   */
  loglevel?: C_System.LogLevel;
}

export default class RunWorker extends EventEmitter {
  private worker: Worker;
  public id: string = generateSyncId(8);
  public name: string;

  constructor(data: WorkerData) {
    super();
    this.name = data.prefix;
    const filename = require.resolve("./worker");
    // logger.info("Worker resolved", filename);
    this.worker = new Worker(require.resolve(filename), {
      workerData: data,
      env: {},
      name: this.name,
    });
    this.worker.on("exit", (exitCode) => {
      this.emit("exit", exitCode);
    });
    this.worker.on("message", (message: API.Response | API.ResponseError) => {
      if ("event" in message) {
        this.emit("state", message);
      } else if (!message.id) {
        if (message.action === C_API.ApiRequestAction.error) {
          this.emit("error", message);
        } else {
          this.emit("notify", message);
        }
      }
    });
  }

  public emit(eventName: "state", payload: API.ResponseEvent): boolean;
  public emit(eventName: "exit", exitCode: number): boolean;
  public emit(eventName: "notify", payload: Omit<API.Response, "id">): boolean;
  public emit(
    eventName: "error",
    payload: Omit<API.ResponseError, "id">
  ): boolean;
  public emit(eventName: string, payload: any) {
    return super.emit(eventName, payload);
  }

  public on(
    eventName: "state",
    listener: (payload: API.ResponseEvent) => void
  ): this;
  public on(eventName: "exit", listener: (exitCode: number) => void): this;
  public on(
    eventName: "notify",
    listener: (payload: Omit<API.Response, "id">) => void
  ): this;
  public on(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return super.on(eventName, listener);
  }

  public async request(
    data: Omit<API.Request, "id">
  ): Promise<Omit<API.Response, "id">> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Timeout exceeded")),
        10_000
      );
      const minId = 1_000_000;
      const maxId = 9_999_999;
      const id = Math.floor(Math.random() * (maxId - minId) + minId);
      this.worker.on(
        "message",
        (message: API.ResponseRequest | API.ResponseError) => {
          if (message.id === id) {
            clearTimeout(timeout);
            delete message.id;
            if (message.action !== C_API.ApiRequestAction.error) {
              resolve(message);
            } else {
              reject(message);
            }
          }
        }
      );
      this.worker.on("error", (error: Error) => reject(error));
      this.worker.on("messageerror", (error: Error) => reject(error));
      this.worker.postMessage({ ...data, id });
    });
  }

  public send(data: Omit<API.Request, "id">) {
    this.worker.postMessage(data);
  }

  public stop() {
    return this.worker.terminate();
  }
}

module.exports = RunWorker;
