import DHT from "../modules/dht";
import connections from "./connections";
import stateManager from "./state";
import storage from "./storage";
import * as Types from "../types";
import { dhtModel } from "./model";

const dht = new DHT({
  state: stateManager,
  storage,
  connections,
  model: dhtModel,
});

stateManager.subscribe([Types.Event.Type.configDhtLookup], ([value]) => {
  dht.setPermission(Types.DHT.Type.dhtLookup, value);
});
stateManager.subscribe([Types.Event.Type.configDhtAnnounce], ([value]) => {
  dht.setPermission(Types.DHT.Type.dhtAnnounce, value);
});

stateManager.subscribe([Types.Event.Type.configDhtBootstrap], ([value]) => {
  dht.setPermission(Types.DHT.Type.dhtBootstrap, value);
  switch (value) {
    case Types.Connection.Group.all:
      stateManager.emit(Types.Event.Type.dhtService, Types.System.States.full);
      break;
    case Types.Connection.Group.friends:
      stateManager.emit(Types.Event.Type.dhtService, Types.System.States.ok);
      break;
    case Types.Connection.Group.selfUser:
    case Types.Connection.Group.selfNode:
      stateManager.emit(
        Types.Event.Type.dhtService,
        Types.System.States.limited
      );
      break;
    default:
      // disabled
      stateManager.emit(
        Types.Event.Type.dhtService,
        Types.System.States.disabled
      );
      break;
  }
});

export default dht;
