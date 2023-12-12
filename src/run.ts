import { C_System } from "@dogma-project/constants-meta";
import { Worker } from "node:worker_threads";
import generateSyncId from "./modules/generateSyncId";
import logger from "./modules/logger";

interface WorkerData {
  prefix: string;
  /**
   * if not specified, port switched randomly
   */
  apiPort?: number;
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

export default class RunWorker {
  private worker: Worker;
  public id: string = generateSyncId(8);
  public apiPort?: number;
  public name: string;

  constructor(data: WorkerData) {
    this.name = data.prefix;
    const filename = require.resolve("./worker");
    this.worker = new Worker(require.resolve(filename), {
      workerData: data,
      env: {},
      name: this.name,
    });
    if (data.apiPort) this.apiPort = data.apiPort;
    this.worker.on("message", (message) => {
      logger.debug("Worker", this.name, message);
      if (!message || !message.type) return;
      switch (message.type) {
        case "api-port":
          if (message.payload) this.apiPort = message.payload;
          break;
      }
    });
  }

  public stop() {
    return this.worker.terminate();
  }
}
