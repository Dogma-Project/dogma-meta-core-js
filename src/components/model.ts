import state from "./state";
import stateManager from "./state";
import { Event, System } from "../types";
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

const configModel = new ConfigModel({ state });
const nodeModel = new NodeModel({ state });
const dhtModel = new DHTModel({ state });
const userModel = new UserModel({ state });

stateManager.subscribe([Event.Type.start, Event.Type.homeDir], () => {
  configModel.init();
  nodeModel.init();
  dhtModel.init();
  userModel.init();
});

stateManager.subscribe([Event.Type.configDb], (value: System.States) => {
  switch (value) {
    case System.States.ready:
    case System.States.reload:
      configModel.loadConfigTable();
      break;
    case System.States.empty:
      logger.log("CONFIG MODEL", "is empty");
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
});

stateManager.subscribe([Event.Type.usersDb], (value: System.States) => {
  switch (value) {
    case System.States.ready:
    case System.States.reload:
      userModel.loadUsersTable();
      break;
    case System.States.empty:
      logger.log("USER MODEL", "is empty");
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
});

stateManager.subscribe([Event.Type.nodesDb], (value: System.States) => {
  switch (value) {
    case System.States.ready:
    case System.States.reload:
      nodeModel.loadNodesTable();
      break;
    case System.States.empty:
      logger.log("NODE MODEL", "is empty");
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
});

export { dhtModel, nodeModel, userModel, configModel };
