// process.env.prefix = "test-1";

import { Keys, State, Model, Types, Connections, System } from "../index";
import { DEFAULTS } from "../constants";
import logger from "../modules/logger";
import assert from "node:assert";

const testPrefix = "test-1";

State.stateManager.subscribe([Types.Event.Type.services], ([services]) => {
  logger.debug("TEST", "services", services);
});

/**
 * Test messages
 */
State.stateManager.subscribe([Types.Event.Type.online], ([online]) => {
  const message: Types.Request = {
    class: Types.Streams.MX.messages,
    body: {
      type: Types.Message.Type.direct,
      action: Types.Message.Action.send,
      data: {
        text: "ok",
      },
    },
  };
  Connections.sendRequestToNode(message, online);
});

// State.stateManager.subscribe(
//   [Types.Event.Type.dataMessages],
//   ([dataMessages]) => {
//     const data = dataMessages.toString();
//     const expected = {
//       type: Types.Message.Type.direct,
//       action: Types.Message.Action.send,
//       data: { text: "ok" },
//     };
//     assert.deepEqual(JSON.parse(data), expected);
//     // ok
//   }
// );

/**
 * Test DHT
 */
// State.stateManager.subscribe([Types.Event.Type.online], ([online]) => {
//   const message: Types.DHT.Abstract = {
//     class: Types.Streams.MX.dht,
//     body: {
//       type: Types.DHT.Request.announce,
//       action: Types.DHT.Action.push,
//       data: {
//         port: 100500,
//       },
//     },
//   };
//   Connections.sendRequestToNode(message, online);
// });

// State.stateManager.subscribe([Types.Event.Type.dataDht], ([dataDht]) => {
//   const data = dataDht.toString();
//   const expected = {
//     type: Types.DHT.Request.announce,
//     action: Types.DHT.Action.push,
//     data: { port: 100500 },
//   };
//   assert.deepEqual(JSON.parse(data), expected);
//   // ok
// });

const main = async () => {
  try {
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
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
};

System.run(testPrefix);

State.stateManager.subscribe([Types.Event.Type.dirStatus], ([homeDir]) => {
  if (homeDir === Types.System.States.full) {
    main()
      .then(() => {
        logger.debug("TEST", "Start test passed!");
      })
      .catch((err) => {
        logger.error("TEST", err);
        logger.debug("TEST", "Start test not passed!");
      });
  } else if (homeDir === Types.System.States.empty) {
    State.stateManager.emit(Types.Event.Type.dirStatus, testPrefix);
  }
});
