import logger from "../modules/logger";
import StateManager from "../modules/state";
import { C_Event } from "@dogma-project/constants-meta";

const stateManager = new StateManager([
  C_Event.Type.server,
  C_Event.Type.storageUser,
  C_Event.Type.storageNode,
  C_Event.Type.configDb,
  C_Event.Type.nodesDb,
  C_Event.Type.usersDb,
  C_Event.Type.messagesDb,
  C_Event.Type.localDiscovery,
  C_Event.Type.dirStatus,
  C_Event.Type.dhtService,
]);

export default stateManager;
