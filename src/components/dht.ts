import DHT from "../modules/dht";
import stateManager from "./state";
import { Types } from "../types";

const dht = new DHT();

stateManager.subscribe(["config-dhtLookup"], (_action, value, _type) => {
  dht.setPermission(Types.DHT.Type.dhtLookup, value);
  if (value > Types.Connection.Group.selfUser) {
    stateManager.services.dhtLookup = Types.System.States.disabled;
  } else if (value === Types.Connection.Group.all) {
    stateManager.services.dhtLookup = Types.System.States.full;
  } else {
    stateManager.services.dhtLookup = Types.System.States.ok;
  }
});
stateManager.subscribe(["config-dhtAnnounce"], (_action, value, _type) => {
  dht.setPermission(Types.DHT.Type.dhtAnnounce, value);
  if (value > Types.Connection.Group.selfUser) {
    stateManager.services.dhtAnnounce = Types.System.States.disabled;
  } else if (value === Types.Connection.Group.all) {
    stateManager.services.dhtAnnounce = Types.System.States.full;
  } else {
    stateManager.services.dhtAnnounce = Types.System.States.ok;
  }
});
stateManager.subscribe(["config-bootstrap"], (_action, value, _type) => {
  dht.setPermission(Types.DHT.Type.dhtBootstrap, value);
  if (value > Types.Connection.Group.selfUser) {
    stateManager.services.dhtBootstrap = Types.System.States.disabled;
  } else if (value === Types.Connection.Group.all) {
    stateManager.services.dhtBootstrap = Types.System.States.full;
  } else {
    stateManager.services.dhtBootstrap = Types.System.States.ok;
  }
});

export default dht;
