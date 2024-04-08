import { Worker } from "node:worker_threads";
import { EventEmitter } from "node:stream";
import { C_API } from "./constants";
import generateSyncId from "./modules/generateSyncId";
import { API } from "./types";
import * as Types from "./types";

class RunWorker extends EventEmitter {
  private worker: Worker;
  private id: string = generateSyncId(8);
  private name: string;
  private stack = new Map<number, [Function, Function]>();

  constructor(data: Types.Worker.Options) {
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
    this.worker.on("message", (message: API.Response | API.ResponseError) => {
      if ("event" in message) {
        this.emit("state", message);
      } else {
        if (message.id === undefined) {
          if (message.action === C_API.ApiRequestAction.error) {
            this.emit("error", message);
          } else {
            this.emit("notify", message);
          }
        } else {
          const handlers = this.stack.get(message.id);
          if (handlers) {
            if (message.action === C_API.ApiRequestAction.error) {
              handlers[1](message);
            } else {
              handlers[0](message);
            }
          }
        }
      }
    });
  }

  /**
   * get worker id
   * @returns unique worker ID
   */
  public getId() {
    return this.id;
  }

  /**
   * 
   * @returns worker name
   */
  public getName() {
    return this.name;
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

  /**
   * @todo rewrite function to stack
   * @param data
   * @returns
   */
  public async request(
    data: Omit<API.Request, "id">
  ): Promise<Omit<API.Response, "id">> {
    return new Promise((resolve, reject) => {
      const minId = 1_000_000;
      const maxId = 9_999_999;
      const id = Math.floor(Math.random() * (maxId - minId) + minId);
      const timeout = setTimeout(() => {
        reject(new Error("Timeout exceeded"));
        this.stack.delete(id);
      }, 10_000);
      this.stack.set(id, [
        (msg: API.ResponseRequest) => {
          clearTimeout(timeout);
          delete msg.id;
          resolve(msg);
          this.stack.delete(id);
        },
        (msg: API.ResponseError) => {
          clearTimeout(timeout);
          delete msg.id;
          reject(msg);
          this.stack.delete(id);
        },
      ]);
      this.worker.postMessage({ ...data, id });
    });
  }

  public send(data: Omit<API.Request, "id">) {
    this.worker.postMessage(data);
  }

  /**
   * Terminates worker thread
   * @returns Returns exit code when worker stopped
   */
  public stop() {
    return this.worker.terminate();
  }
}

export { RunWorker };
module.exports = { RunWorker };
