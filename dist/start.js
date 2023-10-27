"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = __importDefault(require("node:process"));
require("./modules/prototypes");
require("./components/server");
require("./components/client");
require("./components/keys");
require("./components/model");
require("./components/homedir");
const state_1 = __importDefault(require("./components/state"));
node_process_1.default.stdin.resume();
/*
process.on("SIGINT", () => {
  console.log("Received SIGINT. Press Control-D to exit.");
});

function handle(signal: NodeJS.Signals) {
  console.log(`Received ${signal}`);
}
process.on("SIGINT", handle);
process.on("SIGTERM", handle);
*/
state_1.default.emit("START" /* Event.Type.start */, true);
// import "./components/migration";
// import "./modules/sync";
