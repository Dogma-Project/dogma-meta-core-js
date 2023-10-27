import process from "node:process";
import "./modules/prototypes";
import "./components/server";
import "./components/client";
import "./components/keys";
import "./components/model";
import "./components/homedir";
import stateManager from "./components/state";
import { Event } from "./types";

process.stdin.resume();

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

stateManager.emit(Event.Type.start, true);

// import "./components/migration";
// import "./modules/sync";
