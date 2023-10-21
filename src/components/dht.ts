import DHT from "../libs/dht";
import { subscribe, services } from "../libs/state-old";
import { Types } from "../types";

const dht = new DHT();

// add validation

subscribe(["config-dhtLookup"], (_action, value, _type) => {
  dht.setPermission(Types.DHT.Type.dhtLookup, value);
  if (value > Types.Connection.Group.selfUser) {
    services.dhtLookup = Types.System.States.disabled;
  } else if (value === Types.Connection.Group.all) {
    services.dhtLookup = Types.System.States.full;
  } else {
    services.dhtLookup = Types.System.States.ok;
  }
});
subscribe(["config-dhtAnnounce"], (_action, value, _type) => {
  dht.setPermission(Types.DHT.Type.dhtAnnounce, value);
  if (value > Types.Connection.Group.selfUser) {
    services.dhtAnnounce = Types.System.States.disabled;
  } else if (value === Types.Connection.Group.all) {
    services.dhtAnnounce = Types.System.States.full;
  } else {
    services.dhtAnnounce = Types.System.States.ok;
  }
});
subscribe(["config-bootstrap"], (_action, value, _type) => {
  dht.setPermission(Types.DHT.Type.dhtBootstrap, value);
  if (value > Types.Connection.Group.selfUser) {
    services.dhtBootstrap = Types.System.States.disabled;
  } else if (value === Types.Connection.Group.all) {
    services.dhtBootstrap = Types.System.States.full;
  } else {
    services.dhtBootstrap = Types.System.States.ok;
  }
});

export default dht;
