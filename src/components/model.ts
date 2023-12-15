import { workerData } from "node:worker_threads";
import { C_Event, C_Connection, C_System } from "@dogma-project/constants-meta";

import stateManager from "./state";
import storage from "./storage";
import {
  ConfigModel,
  NodeModel,
  DHTModel,
  UserModel,
  MessageModel,
  ProtocolModel,
  FileModel,
  SyncModel,
} from "../modules/model";
import logger from "../modules/logger";
import { C_Defaults } from "@dogma-project/constants-meta";
import * as Types from "../types";
import connections from "./connections";

const configModel = new ConfigModel({ state: stateManager });
const nodeModel = new NodeModel({ state: stateManager });
const dhtModel = new DHTModel({ state: stateManager });
const userModel = new UserModel({ state: stateManager });

/**
 * Init not encrypted databases
 */
stateManager.subscribe(
  [C_Event.Type.start, C_Event.Type.dirStatus],
  ([start, homeDir]) => {
    if (homeDir === C_System.States.full) {
      dhtModel.init();
      configModel.init();
    }
  }
);

/**
 * Init encrypted databases
 */
stateManager.subscribe(
  [C_Event.Type.start, C_Event.Type.dirStatus, C_Event.Type.encryptionKey],
  ([start, dirStatus, encryptionKey]) => {
    if (dirStatus === C_System.States.full) {
      userModel.init(encryptionKey);
      nodeModel.init(encryptionKey);
    }
  }
);

stateManager.subscribe(
  [C_Event.Type.friendshipRequest],
  ([friendshipRequest]) => {
    logger.log(
      "MODEL",
      "Handled friendship request from",
      friendshipRequest.user_id
    );
    userModel.persistUser({
      user_id: friendshipRequest.user_id as string,
      name: friendshipRequest.user_name as string,
      requested: true,
    });
  }
);

stateManager.subscribe([C_Event.Type.online], ([online]) => {
  if (online.node_id === storage.node.id) return; // skip self
  const authorized = online.status === C_Connection.Status.authorized;
  if (authorized) {
    nodeModel
      .persistNode({
        user_id: online.user_id as string,
        node_id: online.node_id as string,
        name: online.node_name as string,
      })
      .then(() => {
        stateManager.emit(C_Event.Type.sync, online);
      })
      .catch((err) => {
        logger.warn("Model", "online", err);
      });
  }
});

stateManager.subscribe([C_Event.Type.configDb], async ([configDb]) => {
  try {
    switch (configDb) {
      case C_System.States.ready:
      case C_System.States.reload:
        await configModel.loadConfigTable();
        break;
      case C_System.States.empty:
        logger.info("CONFIG MODEL", "DB is empty");
        if (workerData.auto) {
          await configModel.insertDefaults();
        }
        break;
      case C_System.States.limited:
      case C_System.States.ok:
      case C_System.States.full:
        // ok
        break;
      default:
        // not ok
        break;
    }
  } catch (err) {
    logger.error("DB LOADER", err);
  }
});

stateManager.subscribe(
  [C_Event.Type.usersDb, C_Event.Type.storageUser],
  async ([usersDb, storageUser]) => {
    switch (usersDb) {
      case C_System.States.ready:
      case C_System.States.reload:
        userModel.loadUsersTable();
        break;
      case C_System.States.empty:
        logger.info("USER MODEL", "DB is empty");
        if (storageUser === C_System.States.full) {
          logger.log("USER MODEL", "insert own user into database");
          await userModel.persistUser({
            user_id: storage.user.id || "",
            name: storage.user.name,
          });
        }
        break;
      case C_System.States.limited:
      case C_System.States.ok:
      case C_System.States.full:
        // ok
        break;
      default:
        // not ok
        break;
    }
  }
);

stateManager.subscribe(
  [C_Event.Type.nodesDb, C_Event.Type.storageNode, C_Event.Type.storageUser],
  async ([nodesDb, storageNode, storageUser]) => {
    switch (nodesDb) {
      case C_System.States.ready:
      case C_System.States.reload:
        nodeModel.loadNodesTable();
        break;
      case C_System.States.empty:
        logger.info("NODE MODEL", "DB is empty");
        if (storage.user.id && storage.node.id) {
          logger.log("NODE MODEL", "insert own node into database");
          await nodeModel.persistNode({
            user_id: storage.user.id,
            node_id: storage.node.id,
            name: storage.node.name,
            synced: Date.now(),
          });
        }
        break;
      case C_System.States.limited:
      case C_System.States.ok:
      case C_System.States.full:
        // ok
        break;
      default:
        // not ok
        break;
    }
  }
);

export { dhtModel, nodeModel, userModel, configModel };
