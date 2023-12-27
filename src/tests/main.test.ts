import { describe } from "node:test";
import assert, { strictEqual } from "node:assert";

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
  loglevel: C_System.LogLevel.warnings,
  auto: true,
});

const workerSecondOwn = new RunWorker({
  prefix: "test-2",
  routerPort: 27835,
  loglevel: C_System.LogLevel.warnings,
});

let testingImport = false;

logger.info("TEST", "Running tests");

workerAuto.on("state", async (data) => {
  if (data.event === C_Event.Type.ready) {
    if (data.payload && data.payload === true) {
      if (testingImport === true) return;
      testingImport = true;

      describe("Main test", async () => {
        const cert = await workerAuto.request({
          type: C_API.ApiRequestType.keys,
          action: C_API.ApiRequestAction.get,
        });
        assert(typeof cert.payload === "string");

        const importResult = await workerSecondOwn.request({
          type: C_API.ApiRequestType.keys,
          action: C_API.ApiRequestAction.push,
          payload: { b64: cert.payload },
        });
        assert.deepStrictEqual(importResult, {
          type: 2,
          action: 4,
          payload: true,
        });

        const createSecondNode = await workerSecondOwn.request({
          type: C_API.ApiRequestType.keys,
          action: C_API.ApiRequestAction.set,
          payload: {
            name: "Dogma second own node",
            length: 2048,
            type: C_Keys.Type.nodeKey,
          },
        });
        assert.deepStrictEqual(createSecondNode, {
          type: 2,
          action: 4,
          payload: { result: true },
        });

        const createSettings = await workerSecondOwn.request({
          type: C_API.ApiRequestType.settings,
          action: C_API.ApiRequestAction.push,
        });
        assert.deepStrictEqual(createSettings, {
          type: 1,
          action: 4,
          payload: { result: true },
        });

        const getOwnNode = await workerAuto.request({
          type: C_API.ApiRequestType.node,
          action: C_API.ApiRequestAction.get,
        });
        assert.strictEqual(getOwnNode.type, 5);
        assert.strictEqual(getOwnNode.action, 4);
        assert("payload" in getOwnNode);

        const getOwnNodeById = await workerAuto.request({
          type: C_API.ApiRequestType.node,
          action: C_API.ApiRequestAction.get,
          payload: {
            user_id: getOwnNode.payload.user_id,
            node_id: getOwnNode.payload.node_id,
          },
        });
        assert.strictEqual(getOwnNodeById.type, 5);
        assert.strictEqual(getOwnNodeById.action, 4);
        assert("payload" in getOwnNodeById);

        const editNodeById = await workerAuto.request({
          type: C_API.ApiRequestType.node,
          action: C_API.ApiRequestAction.set,
          payload: {
            user_id: getOwnNodeById.payload.user_id,
            node_id: getOwnNodeById.payload.node_id,
            name: "Edited Node Name",
          },
        });
        assert.deepStrictEqual(editNodeById, {
          type: 5,
          action: 4,
          payload: { edited: 1 },
        });

        const deleteFalseResult = await workerAuto
          .request({
            type: C_API.ApiRequestType.node,
            action: C_API.ApiRequestAction.delete,
            payload: {
              user_id: getOwnNodeById.payload.user_id,
              node_id: getOwnNodeById.payload.node_id,
            },
          })
          .catch((err) => {
            assert.strictEqual(err.type, 5);
            assert.strictEqual(err.action, 5);
          });

        const getOwnUser = await workerAuto.request({
          type: C_API.ApiRequestType.user,
          action: C_API.ApiRequestAction.get,
        });
        assert.strictEqual(getOwnUser.type, C_API.ApiRequestType.user);
        assert.strictEqual(getOwnUser.action, C_API.ApiRequestAction.result);
        assert("payload" in getOwnUser);

        const editOwnUserById = await workerAuto.request({
          type: C_API.ApiRequestType.user,
          action: C_API.ApiRequestAction.set,
          payload: {
            user_id: getOwnUser.payload.user_id,
            name: "Edited User Name",
          },
        });
        assert.deepStrictEqual(editOwnUserById, {
          type: C_API.ApiRequestType.user,
          action: C_API.ApiRequestAction.result,
          payload: { edited: 1 },
        });

        const deleteOwnUserFalseResult = await workerAuto
          .request({
            type: C_API.ApiRequestType.user,
            action: C_API.ApiRequestAction.delete,
            payload: {
              user_id: getOwnUser.payload.user_id,
            },
          })
          .catch((err) => {
            assert.strictEqual(err.type, C_API.ApiRequestType.user);
            assert.strictEqual(err.action, C_API.ApiRequestAction.error);
          });

        const getNetwork = await workerAuto.request({
          type: C_API.ApiRequestType.network,
          action: C_API.ApiRequestAction.get,
        });
        assert.strictEqual(getNetwork.type, C_API.ApiRequestType.network);
        assert.strictEqual(getNetwork.action, C_API.ApiRequestAction.set);
        logger.debug("NETWORK", getNetwork.payload.network);
        // strictEqual(getNetwork.payload.network.length, 2);

        logger.debug("TEST", "FINISHED");
        process.exit();
      });
    }
  }
});
