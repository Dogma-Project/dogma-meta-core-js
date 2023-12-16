import { C_Event, C_Sync } from "@dogma-project/constants-meta";
import stateManager from "./state";
import storage from "./storage";
import logger from "../modules/logger";
import Sync from "../modules/sync";
import connections from "./connections";
import * as Types from "../types";
import { userModel, nodeModel } from "./model";

const SyncModule = new Sync({
  storage,
  state: stateManager,
  connections,
  models: [userModel, nodeModel],
});

SyncModule.on(
  "synced",
  ({ user_id, node_id }: { user_id: string; node_id: string }) => {
    nodeModel
      .persistNode({ user_id, node_id, synced: Date.now() })
      .then((res) => {
        logger.info("SYNC", "Node", node_id, "synced", res);
      })
      .catch((err) => {
        logger.error("SYNC", err);
      });
  }
);

stateManager.subscribe(
  [C_Event.Type.sync, C_Event.Type.nodesDb],
  async ([sync, nodesDb]) => {
    const node = await nodeModel.get(sync.user_id, sync.node_id);
    if (!node) return;
    const { synced } = node;
    SyncModule.request(
      {
        action: C_Sync.Action.get,
        from: !synced ? 0 : synced - 1000,
        time: Date.now(),
      },
      sync.node_id
    );
    // logger.error("PRE", sync);
    // logger.error("PRE 2", nodes);
    // send request
  }
);
