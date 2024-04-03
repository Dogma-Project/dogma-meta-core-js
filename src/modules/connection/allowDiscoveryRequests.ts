import { C_Connection, C_Event } from "../../types/constants";
import ConnectionClass from "../connections";
import { workerData } from "node:worker_threads";

export default function allowDiscoveryRequests(
  this: ConnectionClass,
  direction: C_Connection.Direction
) {
  if (direction === C_Connection.Direction.incoming) {
    if (workerData.discovery) return true;
    const dhtBootstrap = this.stateBridge.get(C_Event.Type.configDhtBootstrap);
    if (dhtBootstrap && dhtBootstrap === C_Connection.Group.all) return true;
  } else {
    if (workerData.discovery) return false;
    const dhtAnnounce = this.stateBridge.get(C_Event.Type.configDhtAnnounce);
    if (dhtAnnounce && dhtAnnounce === C_Connection.Group.all) return true;
    const dhtLookup = this.stateBridge.get(C_Event.Type.configDhtLookup);
    if (dhtLookup && dhtLookup === C_Connection.Group.all) return true;
  }
  return false;
}
