import { C_System } from "@dogma-project/constants-meta";
import { Worker } from "node:worker_threads";
import { EventEmitter } from "node:stream";
import generateSyncId from "./modules/generateSyncId";
import { API } from "./types";

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
    this.worker = new Worker(require.resolve(filename), {
      workerData: data,
      env: {},
      name: this.name,
    });
    this.worker.on("exit", (exitCode) => {
      this.emit("exit", exitCode);
    });
    this.worker.on("message", (message: API.Response) => {
      if (!message.id) this.emit("notify", message);
    });
  }

  public emit(eventName: "exit", exitCode: number): boolean;
  public emit(eventName: "notify", payload: Omit<API.Response, "id">): boolean;
  public emit(eventName: string, payload: any) {
    return super.emit(eventName, payload);
  }

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
      this.worker.on("message", (message: API.Response) => {
        if (message.id === id) {
          clearTimeout(timeout);
          delete message.id;
          resolve(message);
        }
      });
      this.worker.on("error", (error: Error) => reject(error));
      this.worker.on("messageerror", (error: Error) => reject(error));
      this.worker.postMessage({ ...data, id });
    });
  }

  public stop() {
    return this.worker.terminate();
  }
}
