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
          logger.log("CONFIG MODEL", "auto generation with defaults");
          await configModel.persistConfig([
            {
              param: C_Event.Type.configRouter,
              value: workerData.routerPort || C_Defaults.router,
            },
            {
              param: C_Event.Type.configAutoDefine,
              value: C_Defaults.autoDefineIp,
            },
            {
              param: C_Event.Type.configDhtAnnounce,
              value: C_Connection.Group.friends,
            },
            {
              param: C_Event.Type.configDhtLookup,
              value: C_Connection.Group.friends,
            },
            {
              param: C_Event.Type.configDhtBootstrap,
              value: C_Connection.Group.friends,
            },
            {
              param: C_Event.Type.configExternal,
              value: C_Defaults.external,
            },
            {
              param: C_Event.Type.configLocalDiscovery,
              value: C_Defaults.localDiscovery,
            },
          ]);
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
          await userModel.persistUsers([
            {
              user_id: storage.user.id || "",
              name: storage.user.name,
            },
          ]);
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
        if (
          storageNode === C_System.States.full &&
          storageUser === C_System.States.full
        ) {
          logger.log("NODE MODEL", "insert own node into database");
          await nodeModel.persistNodes([
            {
              user_id: storage.user.id || "",
              node_id: storage.node.id || "",
              name: storage.node.name,
            },
          ]);
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
