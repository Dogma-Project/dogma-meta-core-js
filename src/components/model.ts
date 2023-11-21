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
import args from "../modules/arguments";
import { DEFAULTS } from "../constants";

const configModel = new ConfigModel({ state: stateManager });
const nodeModel = new NodeModel({ state: stateManager });
const dhtModel = new DHTModel({ state: stateManager });
const userModel = new UserModel({ state: stateManager });

stateManager.subscribe([Event.Type.start, Event.Type.homeDir], () => {
  configModel.init();
  nodeModel.init();
  dhtModel.init();
  userModel.init();
});

stateManager.subscribe([Event.Type.configDb], async ([configDb]) => {
  try {
    switch (configDb) {
      case System.States.ready:
      case System.States.reload:
        await configModel.loadConfigTable();
        break;
      case System.States.empty:
        logger.log("CONFIG MODEL", "is empty");
        if (args.auto) {
          logger.log("CONFIG MODEL", "auto generation with defaults");
          await configModel.persistConfig({
            [Event.Type.configRouter]: args.port || DEFAULTS.ROUTER,
            [Event.Type.configAutoDefine]: DEFAULTS.AUTO_DEFINE_IP,
            [Event.Type.configDhtAnnounce]: Connection.Group.friends,
            [Event.Type.configDhtLookup]: Connection.Group.friends,
            [Event.Type.configDhtBootstrap]: Connection.Group.friends,
            [Event.Type.configExternal]: DEFAULTS.EXTERNAL,
          });
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
  [Event.Type.usersDb, Event.Type.masterKey],
  async ([usersDb, masterKey]) => {
    switch (usersDb) {
      case System.States.ready:
      case System.States.reload:
        userModel.loadUsersTable();
        break;
      case System.States.empty:
        logger.log("USER MODEL", "is empty");
        if (masterKey === System.States.full) {
          logger.log("USER MODEL", "insert own user into database");
          await userModel.persistUser({
            user_id: storage.user.id || "",
            name: storage.user.name,
          });
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
  [Event.Type.nodesDb, Event.Type.nodeKey],
  async ([nodesDb, nodeKey]) => {
    switch (nodesDb) {
      case System.States.ready:
      case System.States.reload:
        nodeModel.loadNodesTable();
        break;
      case System.States.empty:
        logger.log("NODE MODEL", "is empty");
        if (nodeKey === System.States.full) {
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
