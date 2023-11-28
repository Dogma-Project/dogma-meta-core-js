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

stateManager.subscribe(
  [Types.Event.Type.configDhtLookup],
  ([configDhtLookup]) => {
    dht.setPermission(Types.DHT.Type.dhtLookup, configDhtLookup as number);
  }
);
stateManager.subscribe(
  [Types.Event.Type.configDhtAnnounce],
  ([configDhtAnnounce]) => {
    dht.setPermission(Types.DHT.Type.dhtAnnounce, configDhtAnnounce as number);
  }
);

stateManager.subscribe(
  [Types.Event.Type.configDhtBootstrap],
  ([configDhtBootstrap]) => {
    dht.setPermission(
      Types.DHT.Type.dhtBootstrap,
      configDhtBootstrap as number
    );
    switch (configDhtBootstrap) {
      case Types.Connection.Group.all:
        stateManager.emit(
          Types.Event.Type.dhtService,
          Types.System.States.full
        );
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
  }
);

export default dht;
