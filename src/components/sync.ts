import { C_Event, C_Sync, C_System } from "@dogma-project/constants-meta";
import stateManager from "./state";
import storage from "./storage";
import logger from "../modules/logger";
import Sync from "../modules/sync";
import connections from "./connections";
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
      .silentUpdateNode({ user_id, node_id, synced: Date.now() })
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
    if (nodesDb === C_System.States.full) {
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
    }
  }
);

stateManager.subscribe([C_Event.Type.nodesDb], ([nodesDb]) => {
  if (nodesDb === C_System.States.reload) {
    SyncModule.multicast({
      action: C_Sync.Action.notify,
      type: C_Sync.Type.nodes,
      time: Date.now(),
    });
  }
});

stateManager.subscribe([C_Event.Type.usersDb], ([usersDb]) => {
  if (usersDb === C_System.States.reload) {
    SyncModule.multicast({
      action: C_Sync.Action.notify,
      type: C_Sync.Type.users,
      time: Date.now(),
    });
  }
});

export default SyncModule;
