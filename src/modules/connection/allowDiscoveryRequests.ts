import worker from "node:worker_threads";
import { C_Connection, C_Event } from "../../constants";
import ConnectionClass from "../connections";
import { Connection } from "../../types";

export default function allowDiscoveryRequests(
  this: ConnectionClass,
  direction: Connection.Direction
) {
  if (direction === C_Connection.Direction.incoming) {
    if (worker.workerData.discovery) return true;
    const dhtBootstrap = this.stateBridge.get(C_Event.Type.configDhtBootstrap);
    if (dhtBootstrap && dhtBootstrap === C_Connection.Group.all) return true;
  } else {
    if (worker.workerData.discovery) return false;
    const dhtAnnounce = this.stateBridge.get(C_Event.Type.configDhtAnnounce);
    if (dhtAnnounce && dhtAnnounce === C_Connection.Group.all) return true;
    const dhtLookup = this.stateBridge.get(C_Event.Type.configDhtLookup);
    if (dhtLookup && dhtLookup === C_Connection.Group.all) return true;
  }
  return false;
}
