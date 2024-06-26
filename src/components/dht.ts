import DHT from "../modules/dht";
import connections from "./connections";
import stateManager from "./state";
import storage from "./storage";
import { dhtModel } from "./model";
import { C_Event, C_DHT, C_Connection, C_System } from "../constants";
import { Connection } from "../types";

const dht = new DHT({
  state: stateManager,
  storage,
  connections,
  model: dhtModel,
});

stateManager.subscribe([C_Event.Type.configDhtLookup], ([configDhtLookup]) => {
  dht.setPermission(C_DHT.Type.dhtLookup, configDhtLookup as Connection.Group);
});
stateManager.subscribe(
  [C_Event.Type.configDhtAnnounce],
  ([configDhtAnnounce]) => {
    dht.setPermission(
      C_DHT.Type.dhtAnnounce,
      configDhtAnnounce as Connection.Group
    );
  }
);

stateManager.subscribe(
  [C_Event.Type.configDhtBootstrap],
  ([configDhtBootstrap]) => {
    dht.setPermission(
      C_DHT.Type.dhtBootstrap,
      configDhtBootstrap as Connection.Group
    );
    switch (configDhtBootstrap) {
      case C_Connection.Group.all:
        stateManager.emit(C_Event.Type.dhtService, C_System.States.full);
        break;
      case C_Connection.Group.friends:
        stateManager.emit(C_Event.Type.dhtService, C_System.States.ok);
        break;
      case C_Connection.Group.selfUser:
      case C_Connection.Group.selfNode:
        stateManager.emit(C_Event.Type.dhtService, C_System.States.limited);
        break;
      default:
        // disabled
        stateManager.emit(C_Event.Type.dhtService, C_System.States.disabled);
        break;
    }
  }
);

export default dht;
