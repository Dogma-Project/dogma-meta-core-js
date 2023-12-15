import EventEmitter from "node:events";
import logger from "./logger";
import * as Types from "../types";
import Storage from "./storage";
import DogmaSocket from "./socket";
import StateManager from "./state";
import Connections from "./connections";
import { C_Connection, C_Streams, C_Sync } from "@dogma-project/constants-meta";
import Model from "./models/_model";

type SyncParams = {
  connections: Connections;
  state: StateManager;
  storage: Storage;
  models: Model[];
};

class Sync extends EventEmitter {
  connectionsBridge: Connections;
  stateBridge: StateManager;
  storageBridge: Storage;
  private models: Model[];

  constructor({ storage, state, connections, models }: SyncParams) {
    super();

    this.connectionsBridge = connections;
    this.stateBridge = state;
    this.storageBridge = storage;
    this.models = models;

    this.connectionsBridge.on(C_Streams.MX.sync, (data, socket) => {
      // add validation
      try {
        const str = data.toString();
        const parsed = JSON.parse(str) as Types.Sync.Data;
        this.handle(parsed, socket);
      } catch (err) {
        logger.error("SYNC DATA", err);
      }
    });
  }

  /**
   *
   * @param model
   * @param from Timestamp in milliseconds
   * @returns
   */
  private getModelSync(model: Model | undefined, from: number) {
    if (model && model.getSync) {
      return model.getSync(from || 0);
    } else {
      return Promise.reject(`Can't sync db`);
    }
  }

  /**
   * Handle all
   * @todo check permissions !!! only for own nodes
   * @todo handle timeshift
   * @param request
   * @param socket
   */
  private async handle(request: Types.Sync.Data, socket: DogmaSocket) {
    try {
      // logger.debug(
      //   "SYNC HANDLE",
      //   Date.now(),
      //   request.time,
      //   Date.now() - request.time
      // );
      switch (request.action) {
        case C_Sync.Action.get:
          const result: Types.Sync.Result = {};
          if ("type" in request) {
            const model = this.models.find((m) => m.syncType === request.type);
            result[request.type] = await this.getModelSync(
              model,
              request.from || 0
            );
          } else {
            for (const model of this.models) {
              if (model.syncType !== undefined) {
                result[model.syncType] = await this.getModelSync(
                  model,
                  request.from || 0
                );
              }
            }
          }
          this.response(
            {
              action: C_Sync.Action.push,
              type: "type" in request ? request.type : undefined,
              payload: result,
              time: Date.now(),
            },
            socket
          );
          break;
        case C_Sync.Action.push:
          try {
            if (request.payload) {
              // logger.debug("SYNC", "PUSH!!!", request.payload);
              logger.debug("Sync", "OWN NODE", this.storageBridge.node.id);
              for (const key in request.payload) {
                const syncType = Number(key) as C_Sync.Type;
                const model = this.models.find((m) => m.syncType === syncType);
                if (model && model.pushSync) {
                  let data = request.payload[syncType] || [];
                  if (syncType === C_Sync.Type.nodes) {
                    data = (data as Types.Node.Model[]).filter((n) => {
                      return !(
                        n.user_id === this.storageBridge.user.id &&
                        n.node_id === this.storageBridge.node.id
                      );
                    });
                  }
                  await model.pushSync(data);
                }
              }
              this.emit("synced", {
                user_id: socket.user_id!,
                node_id: socket.node_id!,
              });
            }
          } catch (err) {
            logger.error("Sync", err);
          }
          break;
      }
    } catch (err) {
      logger.error("HANDLE SYNC", err);
    }
  }
  /**
   * Response to sync request
   * @param request
   * @param socket
   */
  private response(request: Types.Sync.Response, socket: DogmaSocket) {
    socket.input.sync && socket.input.sync.write(JSON.stringify(request)); // edit
  }

  /**
   * Send sync request
   */
  public request(request: Types.Sync.Request, node_id: Types.Node.Id) {
    this.connectionsBridge.sendRequestToNode(
      {
        class: C_Streams.MX.sync,
        body: request,
      },
      node_id
    );
  }

  /**
   * Send some sync data to all own nodes
   */
  public notify(request: Types.Sync.Response) {
    this.connectionsBridge.multicast(
      {
        class: C_Streams.MX.sync,
        body: request,
      },
      C_Connection.Group.selfUser
    );
  }
}

export default Sync;
