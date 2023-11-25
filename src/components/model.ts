import stateManager from "./state";
import storage from "./storage";
import { Connection, Event, System } from "../types";
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
import { getArg } from "../modules/arguments";
import { DEFAULTS } from "../constants";

const configModel = new ConfigModel({ state: stateManager });
const nodeModel = new NodeModel({ state: stateManager });
const dhtModel = new DHTModel({ state: stateManager });
const userModel = new UserModel({ state: stateManager });

stateManager.subscribe(
  [Event.Type.start, Event.Type.dirStatus, Event.Type.prefix],
  ([start, homeDir, prefix]) => {
    if (homeDir === System.States.full) {
      configModel.init(prefix);
      nodeModel.init(prefix);
      dhtModel.init(prefix);
      userModel.init(prefix);
    }
  }
);

stateManager.subscribe([Event.Type.configDb], async ([configDb]) => {
  try {
    switch (configDb) {
      case System.States.ready:
      case System.States.reload:
        await configModel.loadConfigTable();
        break;
      case System.States.empty:
        logger.info("CONFIG MODEL", "DB is empty");
        if (getArg(System.Args.auto)) {
          logger.log("CONFIG MODEL", "auto generation with defaults");
          await configModel.persistConfig([
            {
              param: Event.Type.configRouter,
              value: getArg(System.Args.port) || DEFAULTS.ROUTER,
            },
            {
              param: Event.Type.configAutoDefine,
              value: DEFAULTS.AUTO_DEFINE_IP,
            },
            {
              param: Event.Type.configDhtAnnounce,
              value: Connection.Group.friends,
            },
            {
              param: Event.Type.configDhtLookup,
              value: Connection.Group.friends,
            },
            {
              param: Event.Type.configDhtBootstrap,
              value: Connection.Group.friends,
            },
            {
              param: Event.Type.configExternal,
              value: DEFAULTS.EXTERNAL,
            },
          ]);
        }
        break;
      case System.States.limited:
      case System.States.ok:
      case System.States.full:
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
  [Event.Type.usersDb, Event.Type.storageUser],
  async ([usersDb, storageUser]) => {
    switch (usersDb) {
      case System.States.ready:
      case System.States.reload:
        userModel.loadUsersTable();
        break;
      case System.States.empty:
        logger.info("USER MODEL", "DB is empty");
        if (storageUser === System.States.full) {
          logger.log("USER MODEL", "insert own user into database");
          await userModel.persistUsers([
            {
              user_id: storage.user.id || "",
              name: storage.user.name,
            },
          ]);
        }
        break;
      case System.States.limited:
      case System.States.ok:
      case System.States.full:
        // ok
        break;
      default:
        // not ok
        break;
    }
  }
);

stateManager.subscribe(
  [Event.Type.nodesDb, Event.Type.storageNode, Event.Type.storageUser],
  async ([nodesDb, storageNode, storageUser]) => {
    switch (nodesDb) {
      case System.States.ready:
      case System.States.reload:
        nodeModel.loadNodesTable();
        break;
      case System.States.empty:
        logger.info("NODE MODEL", "DB is empty");
        if (
          storageNode === System.States.full &&
          storageUser === System.States.full
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
      case System.States.limited:
      case System.States.ok:
      case System.States.full:
        // ok
        break;
      default:
        // not ok
        break;
    }
  }
);

export { dhtModel, nodeModel, userModel, configModel };
