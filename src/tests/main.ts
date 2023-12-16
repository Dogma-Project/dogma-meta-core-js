import logger from "../modules/logger";
import RunWorker from "../run";
import {
  C_API,
  C_Event,
  C_Keys,
  C_System,
} from "@dogma-project/constants-meta";

const workerAuto = new RunWorker({
  prefix: "test-1",
  routerPort: 27834,
  loglevel: C_System.LogLevel.debug,
  auto: true,
});

const workerSecondOwn = new RunWorker({
  prefix: "test-2",
  routerPort: 27835,
  loglevel: C_System.LogLevel.debug,
});

let testingImport = false;

workerAuto.on("state", async (data) => {
  if (data.event === C_Event.Type.usersDb) {
    logger.debug("state", ">>>>>>>", data.payload);
    if (data.payload && data.payload === C_System.States.full) {
      if (testingImport === true) return;
      testingImport = true;
      const cert = await workerAuto.request({
        type: C_API.ApiRequestType.keys,
        action: C_API.ApiRequestAction.get,
      });
      const res = await workerSecondOwn.request({
        type: C_API.ApiRequestType.keys,
        action: C_API.ApiRequestAction.push,
        payload: cert.payload,
      });
      logger.debug("IMPORT", "USER KEY", res);

      const res2 = await workerSecondOwn.request({
        type: C_API.ApiRequestType.keys,
        action: C_API.ApiRequestAction.set,
        payload: {
          name: "Dogma second own node",
          length: 2048,
          type: C_Keys.Type.nodeKey,
        },
      });
      logger.debug("CREATE NODE", res2);

      const res3 = await workerSecondOwn.request({
        type: C_API.ApiRequestType.settings,
        action: C_API.ApiRequestAction.push,
      });
      logger.debug("CREATE SETTINGS", res3);

      const res4 = await workerAuto.request({
        type: C_API.ApiRequestType.node,
        action: C_API.ApiRequestAction.get,
      });
      logger.debug("OWN NODE", res4);

      const res5 = await workerAuto.request({
        type: C_API.ApiRequestType.node,
        action: C_API.ApiRequestAction.get,
        payload: {
          user_id: res4.payload.user_id,
          node_id: res4.payload.node_id,
        },
      });
      logger.debug("GET NODE BY ID", res5);

      const res6 = await workerAuto.request({
        type: C_API.ApiRequestType.node,
        action: C_API.ApiRequestAction.set,
        payload: {
          user_id: res4.payload.user_id,
          node_id: res4.payload.node_id,
          name: "Edited Node Name",
        },
      });
      logger.debug("EDIT NODE NAME", res6);

      const res7 = await workerAuto.request({
        type: C_API.ApiRequestType.node,
        action: C_API.ApiRequestAction.delete,
        payload: {
          user_id: res4.payload.user_id,
          node_id: res4.payload.node_id,
        },
      });
      logger.debug("DELETE NODE NAME", res7);
    }
  }
});
