import logger from "../modules/logger";
import StateManager from "../modules/state";
import { C_Event, C_System } from "../constants";

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

stateManager.subscribe(
  [
    C_Event.Type.server,
    C_Event.Type.storageUser,
    C_Event.Type.storageNode,
    C_Event.Type.configDb,
    C_Event.Type.nodesDb,
    C_Event.Type.usersDb,
    C_Event.Type.dirStatus,
  ],
  (states) => {
    const result = states.every((s) => s >= C_System.States.ok);
    logger.debug("STATE", "APP READY");
    stateManager.emit(C_Event.Type.ready, true);
  }
);

export default stateManager;
