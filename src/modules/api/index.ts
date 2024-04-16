import { worker } from "@dogma-project/core-meta-be-node";
import logger from "../logger";
import { API } from "../../types";
import { C_API } from "../../constants";

import {
  KeysController,
  NetworkController,
  ServicesController,
  SettingsController,
  SystemController,
  NodeController,
  UserController,
  CertificateController,
} from "./controllers";

export default class WorkerApi {
  parentPort: worker.MessagePort | null;

  constructor() {
    this.parentPort = worker.parentPort;
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
  private nodeController = NodeController;
  private userController = UserController;
  private certController = CertificateController;

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
        case C_API.ApiRequestType.user:
          this.userController(data);
          break;
        case C_API.ApiRequestType.node:
          this.nodeController(data);
          break;
        case C_API.ApiRequestType.certificate:
          this.certController(data);
          break;
        default:
          // 404
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  public notify(data: Omit<API.ResponseRequest, "id"> | API.ResponseError) {
    if (this.parentPort) {
      this.parentPort.postMessage(data);
    } else {
      logger.warn("API", "NOTIFY", "Parent port not available!");
    }
  }

  protected response(data: API.ResponseRequest) {
    if (data.id === undefined) return this.notify(data);
    if (this.parentPort) {
      this.parentPort.postMessage(data);
    } else {
      logger.warn("API", "RESPONSE", "Parent port not available!");
    }
  }

  protected error(data: API.ResponseError) {
    if (data.id === undefined) return this.notify(data);
    if (this.parentPort) {
      this.parentPort.postMessage(data);
    } else {
      logger.warn("API", "ERROR", "Parent port not available!");
    }
  }
}
