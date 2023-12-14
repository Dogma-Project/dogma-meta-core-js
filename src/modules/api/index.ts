import logger from "../logger";
import { C_API } from "@dogma-project/constants-meta";
import { parentPort, MessagePort } from "node:worker_threads";
import { API } from "../../types";
import {
  KeysController,
  NetworkController,
  ServicesController,
  SettingsController,
  SystemController,
} from "./controllers";

export default class WorkerApi {
  parentPort: MessagePort | null;

  constructor() {
    this.parentPort = parentPort;
    if (this.parentPort) {
      this.parentPort.on("message", (data) => {
        this.handle(data);
      });
    } else {
      logger.warn("API", "REQUEST", "Parent port not available!");
    }
  }

  private servicesController = ServicesController;
  private settingsController = SettingsController;
  private keysController = KeysController;
  private networkController = NetworkController;
  private systemController = SystemController;

  private handle(data: API.Request) {
    try {
      switch (data.type) {
        case C_API.ApiRequestType.services:
          this.servicesController(data);
          break;
        case C_API.ApiRequestType.settings:
          this.settingsController(data);
          break;
        case C_API.ApiRequestType.keys:
          this.keysController(data);
          break;
        case C_API.ApiRequestType.network:
          this.networkController(data);
          break;
        case C_API.ApiRequestType.system:
          this.systemController(data);
          break;
        default:
          // 404
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  protected response(data: API.Response) {
    if (this.parentPort) {
      this.parentPort.postMessage(data);
    } else {
      logger.warn("API", "REQUEST", "Parent port not available!");
    }
  }

  public notify(data: Omit<API.Response, "id">) {
    if (this.parentPort) {
      this.parentPort.postMessage(data);
    } else {
      logger.warn("API", "REQUEST", "Parent port not available!");
    }
  }
}
