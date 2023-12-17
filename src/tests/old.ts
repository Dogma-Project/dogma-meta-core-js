// import { describe, it } from "node:test";
// import assert from "node:assert";
// import RunWorker from "../run";
// import { C_API, C_System } from "@dogma-project/constants-meta";

// const worker1 = new RunWorker({
//   prefix: "test-1",
//   routerPort: 27834,
//   loglevel: C_System.LogLevel.errors,
//   auto: true,
// });

// const worker2 = new RunWorker({
//   prefix: "test-2",
//   routerPort: 27835,
//   loglevel: C_System.LogLevel.errors,
//   auto: true,
// });

// describe("Functional test", async () => {
//   const result = await worker1.request({
//     type: C_API.ApiRequestType.services,
//     action: C_API.ApiRequestAction.get,
//   });
//   it("Get Services", async (t) => {
//     assert.strictEqual(result.action, C_API.ApiRequestAction.set);
//     assert.strictEqual(result.type, C_API.ApiRequestType.services);
//     assert.strictEqual(Array.isArray(result.payload.services), true);
//   });
//   process.exit();
// });
