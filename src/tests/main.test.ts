// process.env.loglevel = "1";
// process.env.prefix = "test-0";

// import { describe, it } from "node:test";
// import { Keys, State, Model, System } from "../worker";
// import { C_Defaults } from "@dogma-project/constants-meta";

// import {
//   C_Event,
//   C_System,
//   C_Keys,
//   C_Connection,
// } from "@dogma-project/constants-meta";
// const testPrefix = "test-0";
// System.run(testPrefix);

// describe("Functional test", () => {
//   it("Start", (t) => {
//     State.stateManager.subscribe([C_Event.Type.services], ([services]) => {
//       // console.log("Services", services);
//     });
//   });

//   it("main", async () => {
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
//       {
//         param: C_Event.Type.configLocalDiscovery,
//         value: C_Defaults.localDiscovery,
//       },
//     ]);
//     await Model.configModel.persistConfig({
//       param: C_Event.Type.configLocalDiscovery,
//       value: false,
//     });
//     await Model.configModel.persistConfig({
//       param: C_Event.Type.configLocalDiscovery,
//       value: true,
//     });
//     process.exit();
//   });
// });
