// // process.env.prefix = "test-1";

// import { Keys, State, Model, Types, Connections, System } from "../worker";
// import { C_Defaults } from "@dogma-project/constants-meta";

// import logger from "../modules/logger";
// import {
//   C_Event,
//   C_System,
//   C_Streams,
//   C_Message,
//   C_Keys,
//   C_Connection,
// } from "@dogma-project/constants-meta";

// const testPrefix = "test-1";

// State.stateManager.subscribe([C_Event.Type.services], ([services]) => {
//   logger.debug("TEST", "services", services);
// });

// /**
//  * Test messages
//  */
// State.stateManager.subscribe([C_Event.Type.online], ([online]) => {
//   const message: Types.Request = {
//     class: C_Streams.MX.messages,
//     body: {
//       type: C_Message.Type.direct,
//       action: C_Message.Action.send,
//       data: {
//         text: "ok",
//       },
//     },
//   };
//   Connections.sendRequestToNode(message, online);
// });

// // State.stateManager.subscribe(
// //   [Types.Event.Type.dataMessages],
// //   ([dataMessages]) => {
// //     const data = dataMessages.toString();
// //     const expected = {
// //       type: Types.Message.Type.direct,
// //       action: Types.Message.Action.send,
// //       data: { text: "ok" },
// //     };
// //     assert.deepEqual(JSON.parse(data), expected);
// //     // ok
// //   }
// // );

// /**
//  * Test DHT
//  */
// // State.stateManager.subscribe([Types.Event.Type.online], ([online]) => {
// //   const message: Types.DHT.Abstract = {
// //     class: Types.Streams.MX.dht,
// //     body: {
// //       type: Types.DHT.Request.announce,
// //       action: Types.DHT.Action.push,
// //       data: {
// //         port: 100500,
// //       },
// //     },
// //   };
// //   Connections.sendRequestToNode(message, online);
// // });

// // State.stateManager.subscribe([Types.Event.Type.dataDht], ([dataDht]) => {
// //   const data = dataDht.toString();
// //   const expected = {
// //     type: Types.DHT.Request.announce,
// //     action: Types.DHT.Action.push,
// //     data: { port: 100500 },
// //   };
// //   assert.deepEqual(JSON.parse(data), expected);
// //   // ok
// // });

// const main = async () => {
//   try {
//     State.storage.user.name = "Test user";
//     State.storage.node.name = "Test node";
//     await Keys.createKeyPair(C_Keys.Type.userKey, testPrefix, 2048);
//     State.stateManager.emit(C_Event.Type.masterKey, C_System.States.ready);
//     await Keys.createKeyPair(C_Keys.Type.nodeKey, testPrefix, 1024);
//     State.stateManager.emit(C_Event.Type.nodeKey, C_System.States.ready);
//     await Model.configModel.persistConfig([
//       {
//         param: C_Event.Type.configRouter,
//         value: C_Defaults.router + 10000,
//       },
//       {
//         param: C_Event.Type.configAutoDefine,
//         value: C_Defaults.autoDefineIp,
//       },
//       {
//         param: C_Event.Type.configDhtAnnounce,
//         value: C_Connection.Group.friends,
//       },
//       {
//         param: C_Event.Type.configDhtLookup,
//         value: C_Connection.Group.friends,
//       },
//       {
//         param: C_Event.Type.configDhtBootstrap,
//         value: C_Connection.Group.friends,
//       },
//       {
//         param: C_Event.Type.configExternal,
//         value: C_Defaults.external,
//       },
//     ]);
//   } catch (err) {
//     return Promise.reject(err);
//   }
// };

// System.run(testPrefix);

// State.stateManager.subscribe([C_Event.Type.dirStatus], ([homeDir]) => {
//   if (homeDir === C_System.States.full) {
//     main()
//       .then(() => {
//         logger.debug("TEST", "Start test passed!");
//       })
//       .catch((err) => {
//         logger.error("TEST", err);
//         logger.debug("TEST", "Start test not passed!");
//       });
//   } else if (homeDir === C_System.States.empty) {
//     State.stateManager.emit(C_Event.Type.prefix, testPrefix);
//   }
// });
