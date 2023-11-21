import StateManager from "../modules/state";
import { Event } from "../types";

const stateManager = new StateManager([
  Event.Type.server,
  Event.Type.masterKey,
  Event.Type.nodeKey,
  Event.Type.configDb,
  Event.Type.nodesDb,
  Event.Type.usersDb,
  Event.Type.messagesDb,
]);

export default stateManager;
