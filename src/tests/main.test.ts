process.env.loglevel = "1";
process.env.prefix = "test-0";

import { describe, it } from "node:test";

import { Keys, State, Model, Types, System } from "../index";
import { DEFAULTS } from "../constants";

const testPrefix = "test-0";
System.run(testPrefix);

describe("Functional test", () => {
  it("Start", (t) => {
    State.stateManager.subscribe([Types.Event.Type.services], ([services]) => {
      // console.log("Services", services);
    });
  });

  it("main", async () => {
    State.storage.user.name = "Test user";
    State.storage.node.name = "Test node";
    await Keys.createKeyPair(Types.Keys.Type.masterKey, testPrefix, 2048);
    State.stateManager.emit(
      Types.Event.Type.masterKey,
      Types.System.States.ready
    );
    await Keys.createKeyPair(Types.Keys.Type.nodeKey, testPrefix, 1024);
    State.stateManager.emit(
      Types.Event.Type.nodeKey,
      Types.System.States.ready
    );
    await Model.configModel.persistConfig([
      {
        param: Types.Event.Type.configRouter,
        value: 34601,
      },
      {
        param: Types.Event.Type.configAutoDefine,
        value: DEFAULTS.AUTO_DEFINE_IP,
      },
      {
        param: Types.Event.Type.configDhtAnnounce,
        value: Types.Connection.Group.friends,
      },
      {
        param: Types.Event.Type.configDhtLookup,
        value: Types.Connection.Group.friends,
      },
      {
        param: Types.Event.Type.configDhtBootstrap,
        value: Types.Connection.Group.friends,
      },
      {
        param: Types.Event.Type.configExternal,
        value: DEFAULTS.EXTERNAL,
      },
      {
        param: Types.Event.Type.configLocalDiscovery,
        value: true,
      },
    ]);
    await Model.configModel.persistConfig({
      param: Types.Event.Type.configLocalDiscovery,
      value: false,
    });
    await Model.configModel.persistConfig({
      param: Types.Event.Type.configLocalDiscovery,
      value: true,
    });
    process.exit();
  });
});
