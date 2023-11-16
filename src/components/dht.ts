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

stateManager.subscribe([Types.Event.Type.configDhtLookup], (value) => {
  dht.setPermission(Types.DHT.Type.dhtLookup, value);
  // if (value > Types.Connection.Group.selfUser) {
  //   stateManager.services.dhtLookup = Types.System.States.disabled;
  // } else if (value === Types.Connection.Group.all) {
  //   stateManager.services.dhtLookup = Types.System.States.full;
  // } else {
  //   stateManager.services.dhtLookup = Types.System.States.ok;
  // }
});
stateManager.subscribe([Types.Event.Type.configDhtAnnounce], (value) => {
  dht.setPermission(Types.DHT.Type.dhtAnnounce, value);
  // if (value > Types.Connection.Group.selfUser) {
  //   stateManager.services.dhtAnnounce = Types.System.States.disabled;
  // } else if (value === Types.Connection.Group.all) {
  //   stateManager.services.dhtAnnounce = Types.System.States.full;
  // } else {
  //   stateManager.services.dhtAnnounce = Types.System.States.ok;
  // }
});
stateManager.subscribe([Types.Event.Type.configDhtBootstrap], (value) => {
  dht.setPermission(Types.DHT.Type.dhtBootstrap, value);
  // if (value > Types.Connection.Group.selfUser) {
  //   stateManager.services.dhtBootstrap = Types.System.States.disabled;
  // } else if (value === Types.Connection.Group.all) {
  //   stateManager.services.dhtBootstrap = Types.System.States.full;
  // } else {
  //   stateManager.services.dhtBootstrap = Types.System.States.ok;
  // }
});

export default dht;
