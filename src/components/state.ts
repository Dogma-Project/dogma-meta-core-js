import StateManager from "../modules/state";
import { Event } from "../types";

const stateManager = new StateManager([
  Event.Type.server,
  Event.Type.storageUser,
  Event.Type.storageNode,
  Event.Type.configDb,
  Event.Type.nodesDb,
  Event.Type.usersDb,
  Event.Type.messagesDb,
  Event.Type.localDiscovery,
  Event.Type.dirStatus,
]);

export default stateManager;
